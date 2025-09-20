import { Vehicule } from "@/types/vehicule";
import { ParametreEntretien, Notification } from "@/types/entretien";

export function generateAllNotifications(
    vehicules: Vehicule[],
    parametres: ParametreEntretien[]
): Notification[] {
    const notifications: Notification[] = [];
    let notifIdCounter = 1;
    const today = new Date();

    vehicules.forEach((v) => {
        // -----------------------------
        // 1️⃣ Contrôle technique (CT)
        // -----------------------------
        if (v.ctValidite) {
            const ctDate = new Date(v.ctValidite);
            const diffDays = Math.ceil((ctDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            let ctMessage = "";
            let ctPriority: Notification["priority"] = "normal";

            if (diffDays < 0) {
                ctMessage = `Le CT de ${v.immat} est expiré !`;
                ctPriority = "urgent";
            } else if (diffDays <= 7) {
                ctMessage = `Le CT de ${v.immat} expire dans ${diffDays} jour(s) !`;
                ctPriority = "urgent";
            } else if (diffDays <= 14) {
                ctMessage = `Le CT de ${v.immat} expire bientôt dans ${diffDays} jours`;
            } else if (diffDays <= 30) {
                ctMessage = `Pensez à programmer le CT de ${v.immat}, il expire dans ${diffDays} jours`;
            }

            if (ctMessage) {
                notifications.push({
                    id: notifIdCounter++,
                    type: "CT",
                    message: ctMessage,
                    vehicleId: v.id,
                    seen: false,
                    priority: ctPriority,
                    date: ctDate,
                });
            }
        }

        // -----------------------------
        // 2️⃣ Maintenance prédictive
        // -----------------------------
        parametres.forEach((p) => {
            const dernierDepense = v.depense
                ?.filter(d => d.reparation === p.type)
                .sort((a, b) => b.km - a.km)[0];

            if (!dernierDepense) return;

            const dernierKm = dernierDepense.km;
            const kmAvantNotif = p.alertKmBefore ?? 0;
            const kmRestant = p.seuilKm - (v.km - dernierKm);
            if (kmRestant <= kmAvantNotif) {
                const existingNotification = notifications.find(
                    n => n.vehicleId === v.id &&
                        n.type === "Entretien" &&
                        n.itemId === p.itemId
                );

                if (!existingNotification) {
                    notifications.push({
                        id: notifIdCounter++,
                        type: "Entretien",
                        itemId: p.itemId, // ⚡️ référence la pièce/intervention
                        message: kmRestant > 0
                            ? `La pièce "${p.type}" de ${v.immat} sera à contrôler dans ${kmRestant} km`
                            : `La pièce "${p.type}" de ${v.immat} a dépassé le seuil de ${p.seuilKm} km !`,
                        vehicleId: v.id,
                        km: v.km,
                        seen: false,
                        priority: kmRestant <= 0 ? "urgent" : "normal",
                        date: new Date(),
                    });
                }
            }
        });

        // -----------------------------
        // 3️⃣ Prochaine révision
        // -----------------------------
        if (v.prochaineRevision) {
            const revisionDate = new Date(v.prochaineRevision);
            const diffDays = Math.ceil((revisionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            let revisionMessage = "";
            let revisionPriority: Notification["priority"] = "normal";

            if (diffDays < 0) {
                revisionMessage = `La révision de ${v.immat} est passée !`;
                revisionPriority = "urgent";
            } else if (diffDays <= 7) {
                revisionMessage = `La prochaine révision de ${v.immat} arrive dans ${diffDays} jour(s)`;
            }

            if (revisionMessage) {
                notifications.push({
                    id: notifIdCounter++,
                    type: "Revision",
                    message: revisionMessage,
                    vehicleId: v.id,
                    seen: false,
                    priority: revisionPriority,
                    date: revisionDate,
                });
            }
        }
    });

    return notifications;
}