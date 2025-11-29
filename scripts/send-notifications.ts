import { sendDailyNotifications } from "@/lib/notificationService";

async function main() {
  console.log("🚀 Envoi des notifications en cours...");
  try {
    const result = await sendDailyNotifications();
    console.log("✅ Résultat :", result);
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit(1);
  }
}

main();
