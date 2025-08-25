import { ParametreEntretien } from "@/types/entretien";
import { Vehicule } from "@/types/vehicule";

export interface Notification {
    id: number;
    type: string;
    message: string;
    vehicleId: number;
    date?: Date;
    km?: number;
    seen: boolean;
    priority: "urgent" | "normal";
}

export function generateNotifications(
    vehicules: Vehicule[],
    parametres: ParametreEntretien[]
): Notification[] {
    const notifications: Notification[] = [];
    let notifIdCounter = 1;

    const today = new Date();

    vehicules.forEach(v => {
        // 1️⃣ Contrôle technique
        const ctDate = new Date(v.ctValidite);
        const diffDays = Math.ceil((ctDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays > 0 && diffDays <= 7) {
            notifications.push({
                id: notifIdCounter++,
                type: "CT",
                message: `Le CT de ${v.immat} expire dans ${diffDays} jour(s) !`,
                vehicleId: v.id,
                date: ctDate,
                seen: false,
                priority: "urgent",
            });
        } else if (diffDays > 7 && diffDays <= 14) {
            notifications.push({
                id: notifIdCounter++,
                type: "CT",
                message: `Le CT de ${v.immat} expire bientôt dans ${diffDays} jours`,
                vehicleId: v.id,
                date: ctDate,
                seen: false,
                priority: "normal",
            });
        } else if (diffDays > 14 && diffDays <= 30) {
            notifications.push({
                id: notifIdCounter++,
                type: "CT",
                message: `Pensez à programmer le CT de ${v.immat}, il expire dans ${diffDays} jours`,
                vehicleId: v.id,
                date: ctDate,
                seen: false,
                priority: "normal",
            });
        } else if (diffDays < 0) {
            notifications.push({
                id: notifIdCounter++,
                type: "CT",
                message: `Le CT de ${v.immat} est expiré !`,
                vehicleId: v.id,
                date: ctDate,
                seen: false,
                priority: "urgent",
            });
        }

        // 2️⃣ Maintenance prédictive
        parametres.forEach(p => {
            const dernierKm = p.dernierKm ?? 0;
            const prochainKm = dernierKm + p.seuilKm;
            const kmAvantNotif = 1000; // déclenche notification 1000 km avant

            if (v.km >= prochainKm - kmAvantNotif && v.km < prochainKm) {
                notifications.push({
                    id: notifIdCounter++,
                    type: "Entretien",
                    message: `La pièce "${p.type}" de ${v.immat} sera à contrôler dans ${prochainKm - v.km} km`,
                    vehicleId: v.id,
                    km: v.km,
                    seen: false,
                    priority: "normal",
                });
            }
        });

        // 3️⃣ Prochaine révision
        if (v.prochaineRevision) {
            const revisionDate = new Date(v.prochaineRevision);
            const daysBefore = 7; // notification 7 jours avant la révision
            const diffTime = revisionDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= daysBefore && diffDays >= 0) {
                notifications.push({
                    id: notifIdCounter++,
                    type: "Revision",
                    message: `La prochaine révision de ${v.immat} arrive dans ${diffDays} jour(s)`,
                    vehicleId: v.id,
                    date: revisionDate,
                    seen: false,
                    priority: "normal",
                });
            }

            // Optionnel : si la révision est passée
            if (diffDays < 0) {
                notifications.push({
                    id: notifIdCounter++,
                    type: "Revision",
                    message: `La révision de ${v.immat} est passée !`,
                    vehicleId: v.id,
                    date: revisionDate,
                    seen: false,
                    priority: "urgent",
                });
            }
        }
    });

    return notifications;
}