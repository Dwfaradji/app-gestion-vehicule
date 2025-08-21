// utils/notifications.ts
import { Vehicule } from "@/types/vehicule";
import { ParametreEntretien, Notification } from "@/types/entretien";

export function generateNotifications(
    vehicules: Vehicule[],
    parametres: ParametreEntretien[]
): Notification[] {
    const notifications: Notification[] = [];

    vehicules.forEach(v => {
        // 1️⃣ Contrôle technique
        if (new Date(v.ctValidite) < new Date()) {
            notifications.push({
                type: "CT",
                message: `Le contrôle technique de ${v.immat} est expiré !`,
                vehicleId: v.id,
                date: v.ctValidite,
                seen: false,
            });
        }

        // 2️⃣ Seuils d’entretien
        parametres.forEach(p => {
            const kmDepuisDernier = v.km - (p.dernierKm || 0);
            if (kmDepuisDernier >= p.seuilKm) {
                notifications.push({
                    type: p.type as "Entretien" | "Mécanique" | "Carrosserie",
                    message: `La révision est bientôt a faire sur ${v.immat} (km actuel : ${v.km})`,
                    vehicleId: v.id,
                    km: v.km,
                    seen: false,
                });
            }
        });
    });

    return notifications;
}