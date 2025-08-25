import { Vehicule } from "@/types/vehicule";
import { MaintenanceParam } from "@/data/maintenanceParams";

export interface Notification {
    id: number;
    vehicleId: number;
    type: string;
    message: string;
    km: number;
    priority: "urgent" | "moyen" | "normal";
    seen?: boolean;
}

let notifIdCounter = 1;

export function generateMaintenanceNotifications(
    vehicules: Vehicule[],
    maintenanceParams: MaintenanceParam[]
): Notification[] {
    const notifications: Notification[] = [];

    vehicules.forEach((v) => {
        const currentKm = v.km;

        maintenanceParams
            .filter(param => param.category === "Mécanique" || param.category === "Révision générale")
            .forEach((param) => {
                // // Vérifie si le param est applicable au type de véhicule
                // if (param.applicableTo && !param.applicableTo.includes(v.type)) return;

                // Dernier km enregistré pour cette pièce
                const dernierKm = v.depense?.find(d => d.reparation === param.type)?.km;

                // 🔹 Si aucune intervention n'a été faite, on ignore la notification
                if (dernierKm === undefined) return;

                const kmRestant = param.seuilKm - (currentKm - dernierKm);

                if (kmRestant <= (param.alertKmBefore ?? 0)) {
                    const priority = kmRestant <= 0 ? "urgent" : "moyen";
                    notifications.push({
                        id: notifIdCounter++,
                        vehicleId: v.id,
                        type: param.type,
                        km: currentKm,
                        message: `Vérifier "${param.type}" sur ${v.immat}. ${
                            kmRestant > 0 ? `${kmRestant} km restant` : "dépassé !"
                        }`,
                        priority,
                        seen: false,
                    });
                }
            });
    });

    return notifications;
}