import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { formatDateNumeric } from "@/utils/formatDate";
import { Notification } from "@/types/entretien";

// Config quota
const MAX_EMAILS_PER_HOUR = 150;
const DELAY_BETWEEN_EMAILS_MS = 500; // 0,5 sec entre chaque mail

export async function sendDailyNotifications() {
  try {
    // 1️⃣ Récupérer tous les emails destinataires
    const emails = await prisma.email.findMany();
    if (emails.length === 0) return { message: "Aucun email configuré.", sent: 0, failed: 0 };

    // 2️⃣ Récupérer les notifications des dernières 24h
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const notifications = await prisma.notification.findMany({
      where: { createdAt: { gte: yesterday } },
      orderBy: { createdAt: "desc" },
      include: { vehicule: { select: { immat: true } } },
    });

    // 3️⃣ Filtrer celles à envoyer : CT & REVISION tous les jours, sinon uniquement si !seen
    const notificationsToSend = notifications.filter(
      (n: Notification) => n.type === "CT" || n.type === "REVISION" || !n.send,
    );

    if (notificationsToSend.length === 0)
      return { message: "Aucune notification à envoyer.", sent: 0, failed: 0 };

    // 4️⃣ Fonctions de style
    const priorityColor = (type: string) => {
      switch (type.toUpperCase()) {
        case "ENTRETIEN":
          return "#fee2e2";
        case "REVISION":
          return "#fef3c7";
        case "CT":
          return "#dcfce7";
        default:
          return "#f3f4f6";
      }
    };

    const priorityEmoji = (priority: string) => {
      switch (priority.toUpperCase()) {
        case "URGENT":
          return "🔴";
        case "NORMAL":
          return "🟠";
        case "LOW":
          return "🟢";
        default:
          return "⚪";
      }
    };

    // 5️⃣ Contenu HTML
    const htmlContent = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #1D4ED8;"> Rapport Notification - ${new Date().toLocaleDateString()}</h2>
  <p>Bonjour,</p>
  <p>Voici le résumé des notifications des dernières 24 heures :</p>
  <h2>Legend</h2>
  <p> 
    <span style="font-size: 1em;">🔴</span> URGENT
    <span style="font-size: 1em;">🟠</span> NORMAL
    <span style="font-size: 1em;">🟢</span> RAS
  </p>
  <p> ${notificationsToSend.length} notifications Envoyer.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
    <thead>
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px; background-color: #f3f4f6;">Priority</th>
        <th style="border: 1px solid #ccc; padding: 8px; background-color: #f3f4f6;">Type</th>
        <th style="border: 1px solid #ccc; padding: 8px; background-color: #f3f4f6;">Message</th>
        <th style="border: 1px solid #ccc; padding: 8px; background-color: #f3f4f6;">Vehicule</th>
        <th style="border: 1px solid #ccc; padding: 8px; background-color: #f3f4f6;">Date</th>
      </tr>
    </thead>
    <tbody>
      ${notificationsToSend
        .map(
          (n: typeof notificationsToSend[number]) => `
        <tr style="background-color: ${priorityColor(n.type)};">
          <td style="border: 1px solid #ccc; padding: 8px; text-align: center; font-weight: bold; font-size: 1.1em;">
            <span style="font-size: 1.5em;">${priorityEmoji(n.priority)}</span>
          </td>
          <td style="border: 1px solid #ccc; padding: 8px;">${n.type}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${n.message}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${n.vehicule?.immat ?? "N/A"}</td>
          <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${formatDateNumeric(n.createdAt)}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>
  
</div>
`;

    // 6️⃣ Contenu texte
    const textContent = notificationsToSend
      .map(
        (n: typeof notificationsToSend[number]) =>
          `[${n.priority}] ${n.type}: ${n.message} (Vehicle: ${n.vehicule?.immat ?? "N/A"}) - ${n.createdAt.toLocaleDateString()} ${n.createdAt.toLocaleTimeString()}`,
      )
      .join("\n");

    // 7️⃣ Envoyer par batch pour respecter quota
    let sentCount = 0;
    let failCount = 0;

    for (const email of emails.slice(0, MAX_EMAILS_PER_HOUR)) {
      try {
        await sendEmail(
          email.adresse,
          `Notification Report - ${new Date().toLocaleDateString()}`,
          textContent,
          htmlContent,
        );
        sentCount++;
      } catch (err) {
        console.error(`Failed to send email to ${email.adresse}:`, err);
        failCount++;
      }
      await new Promise((res) => setTimeout(res, DELAY_BETWEEN_EMAILS_MS));
    }

    // 8️⃣ Mettre à jour send pour toutes sauf CT et REVISION
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationsToSend
            .filter((n: { type: string }) => n.type !== "CT" && n.type !== "Revision")
            .map((n: { id: number }) => n.id),
        },
      },
      data: { send: true },
    });

    return { message: "Traitement complet", sent: sentCount, failed: failCount };
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
}
