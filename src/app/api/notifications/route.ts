import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
import { generateNotifications } from "@/utils/vehiculeNotifications";
import { Vehicule } from "@/types/vehicule";
import { ParametreEntretien } from "@/types/entretien";
import { maintenanceParams } from "@/data/maintenanceParams";
import { generateMaintenanceNotifications, Notification as MaintenanceNotification } from "@/utils/generateMaintenanceNotifications";
import nodemailer from "nodemailer";

// 🔹 Fonction pour envoyer les emails
async function sendNotificationEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Gestion Véhicules" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
    });
}

// 🔹 Helpers pour récupérer véhicules et paramètres
async function getVehicules(): Promise<Vehicule[]> {
    return prisma.vehicule.findMany();
}

async function getParametres(): Promise<ParametreEntretien[]> {
    return prisma.entretienParam.findMany();
}

// ======================= POST =======================
export async function POST() {
    try {
        const vehicules = await getVehicules();
        const parametres = await getParametres();

        // 🔹 Génération notifications
        const baseNotifications = generateNotifications(vehicules, parametres);
        const mechNotifications: MaintenanceNotification[] = generateMaintenanceNotifications(
            vehicules,
            maintenanceParams
        );

        const allNotifications = [
            ...baseNotifications,
            ...mechNotifications.map(n => ({
                type: n.type,
                message: n.message,
                vehicleId: n.vehicleId,
                date: n.date ?? new Date(),
                km: n.km,
                seen: n.seen ?? false,
                priority: n.priority,
            })),
        ];

        // 🔹 Stockage en DB et envoi des emails urgents
        const created = [];
        for (const notif of allNotifications) {
            const n = await prisma.notification.upsert({
                where: { id: notif.id ?? 0 }, // si pas d’id, créer nouvelle notification
                update: { ...notif },
                create: { ...notif },
            });
            created.push(n);

            // 🔹 Envoi email si urgent et pas encore envoyé
            if (n.priority === "urgent" && !n.emailSent) {
                await sendNotificationEmail(
                    "responsable@example.com", // remplacer par l’adresse cible
                    `Notification urgente : ${n.type}`,
                    n.message
                );

                // 🔹 Marquer email comme envoyé
                await prisma.notification.update({
                    where: { id: n.id },
                    data: { emailSent: true },
                });
            }
        }

        return new Response(JSON.stringify({ created: created.length }), { status: 201 });
    } catch (err) {
        console.error(err);
        return new Response("Erreur serveur", { status: 500 });
    }
}