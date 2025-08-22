export function generateNotifications(
    vehicules: Vehicule[],
    parametres: ParametreEntretien[]
): Notification[] {
    const notifications: Notification[] = [];
    let notifIdCounter = 1;

    const today = new Date();

    vehicules.forEach(v => {
        // 1️⃣ Contrôle technique
        if (new Date(v.ctValidite) < today) {
            notifications.push({
                id: notifIdCounter++,
                type: "CT",
                message: `Le CT de ${v.immat} est expiré !`,
                vehicleId: v.id,
                date: v.ctValidite,
                seen: false,
                priority: "urgent",
            });
        }

        // 2️⃣ Maintenance prédictive
        parametres.forEach(p => {
            const dernierKm = p.dernierKm ?? 0;
            const prochainKm = dernierKm + p.seuilKm;
            const kmAvantNotif = 1000; // ex: déclenche notification 1000 km avant

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
    });

    return notifications;
}