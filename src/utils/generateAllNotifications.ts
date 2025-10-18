import type { Vehicule } from "@/types/vehicule";
import type { ParametreEntretien, Notification } from "@/types/entretien";
import { CTParams, RevisionParams } from "@/data/maintenanceParams";

export function generateAllNotifications(
  vehicules: Vehicule[],
  parametres: ParametreEntretien[],
): Notification[] {
  const notifications: Notification[] = [];
  let notifIdCounter = 1;
  const today = new Date();

  const createNotification = (
    type: Notification["type"],
    itemId: number,
    vehicleId: number,
    message: string,
    priority: Notification["priority"] = "normal",
    km?: number,
    createdAt?: Date,
  ) => {
    notifications.push({
      id: notifIdCounter++,
      type,
      itemId,
      vehicleId,
      message,
      seen: false,
      priority,
      km,
      createdAt: createdAt ?? new Date(),
    });
  };

  vehicules.forEach((v) => {
    // --- Contrôle technique ---
    if (v.ctValidite) {
      const ctDate = new Date(v.ctValidite);
      const diffDays = Math.ceil((ctDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0)
        createNotification(
          "CT",
          CTParams[0].itemId,
          v.id,
          `Le CT de ${v.immat} est expiré !`,
          "urgent",
          undefined,
          ctDate,
        );
      else if (diffDays <= 7)
        createNotification(
          "CT",
          CTParams[0].itemId,
          v.id,
          `Le CT de ${v.immat} expire dans ${diffDays} jour(s) !`,
          "urgent",
          undefined,
          ctDate,
        );
      else if (diffDays <= 14)
        createNotification(
          "CT",
          CTParams[0].itemId,
          v.id,
          `Le CT de ${v.immat} expire bientôt dans ${diffDays} jours`,
          "normal",
          undefined,
          ctDate,
        );
      else if (diffDays <= 30)
        createNotification(
          "CT",
          CTParams[0].itemId,
          v.id,
          `Pensez à programmer le CT de ${v.immat}, il expire dans ${diffDays} jours`,
          "normal",
          undefined,
          ctDate,
        );
    }

    // --- Maintenance prédictive ---
    parametres.forEach((p) => {
      const dernierDepense = v.depense
        ?.filter((d) => d.reparation === p.type)
        .sort((a, b) => b.km - a.km)[0];
      if (!dernierDepense) return;

      const dernierKm = dernierDepense.km;
      const kmRestant = p.seuilKm - (v.km - dernierKm);
      const kmAvantNotif = p.alertKmBefore ?? 0;

      if (kmRestant <= kmAvantNotif) {
        const exists = notifications.some(
          (n) => n.vehicleId === v.id && n.type === "Entretien" && n.itemId === p.itemId,
        );
        if (!exists) {
          const message =
            kmRestant > 0
              ? `La pièce "${p.type}" de ${v.immat} sera à contrôler dans ${kmRestant} km`
              : `La pièce "${p.type}" de ${v.immat} a dépassé le seuil de ${p.seuilKm} km !`;
          createNotification(
            "Entretien",
            p.itemId,
            v.id,
            message,
            kmRestant <= 0 ? "urgent" : "normal",
            v.km,
          );
        }
      }
    });

    // --- Révision ---
    if (v.prochaineRevision) {
      const revisionDate = new Date(v.prochaineRevision);
      const diffDays = Math.ceil(
        (revisionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays < 0)
        createNotification(
          "Revision",
          RevisionParams[0].itemId,
          v.id,
          `La révision de ${v.immat} est passée !`,
          "urgent",
          undefined,
          revisionDate,
        );
      else if (diffDays <= 7)
        createNotification(
          "Revision",
          RevisionParams[0].itemId,
          v.id,
          `La prochaine révision de ${v.immat} arrive dans ${diffDays} jour(s)`,
          "normal",
          undefined,
          revisionDate,
        );
    }
  });

  return notifications;
}
