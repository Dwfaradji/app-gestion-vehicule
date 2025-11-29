import cron from "node-cron";
import { sendDailyNotifications } from "./notificationService";

// Scheduler : tous les jours à 8h du matin
cron.schedule("0 8 * * *", async () => {
  console.warn("📬 Envoi automatique des notifications quotidiennes...");
  try {
    const result = await sendDailyNotifications();
    console.warn("✅ Notifications envoyées:", result);
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi des notifications:", err);
  }
});
