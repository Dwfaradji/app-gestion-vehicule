import { prisma } from "@/lib/prisma";

export async function createPlanification(data: {
  vehiculeId: number;
  conducteurId: number;
  startDate: string;
  endDate: string;
  type: "JOUR" | "HEBDO" | "MENSUEL" | "ANNUEL";
  note?: string;
  nbreTranches: number;
}) {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  // 1️⃣ Vérifie le chevauchement pour le même véhicule
  const vehiculeOverlap = await prisma.planification.findFirst({
    where: {
      vehiculeId: data.vehiculeId,
      AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
    },
  });

  if (vehiculeOverlap) {
    throw new Error("🚫 Ce véhicule est déjà attribué sur cette période.");
  }

  // 2️⃣ Vérifie si le conducteur a déjà un autre véhicule sur cette période
  const conducteurOverlap = await prisma.planification.findFirst({
    where: {
      conducteurId: data.conducteurId,
      AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
    },
  });

  if (conducteurOverlap) {
    // Si Michel a déjà un plan ANNUEL, il ne peut rien d’autre
    if (conducteurOverlap.type === "ANNUEL") {
      throw new Error("🚫 Ce conducteur est déjà planifié annuellement.");
    }

    // Si Michel a un plan MENSUEL, il ne peut pas avoir HEBDO ou JOUR dans la même période
    if (conducteurOverlap.type === "MENSUEL" && (data.type === "JOUR" || data.type === "HEBDO")) {
      throw new Error("🚫 Ce conducteur a déjà une planification mensuelle sur cette période.");
    }

    // Si Michel a un plan HEBDO, il ne peut pas avoir JOUR dans la même période
    if (conducteurOverlap.type === "HEBDO" && data.type === "JOUR") {
      throw new Error("🚫 Ce conducteur a déjà une planification hebdomadaire sur cette période.");
    }

    // Et inversement : si on tente de créer un plan plus large que celui existant
    if (
      data.type === "ANNUEL" ||
      (data.type === "MENSUEL" && conducteurOverlap.type === "HEBDO") ||
      (data.type === "MENSUEL" && conducteurOverlap.type === "JOUR") ||
      (data.type === "HEBDO" && conducteurOverlap.type === "JOUR")
    ) {
      throw new Error("🚫 Ce conducteur a déjà une planification sur cette période.");
    }
  }

  // 3️⃣ Crée la planification
  return prisma.planification.create({
    data: {
      vehiculeId: data.vehiculeId,
      conducteurId: data.conducteurId,
      startDate: start,
      endDate: end,
      type: data.type,
      note: data.note,
      nbreTranches: data.nbreTranches,
    },
  });
}
