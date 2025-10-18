import { prisma } from "@/lib/prisma";

export async function createPlanification(data: {
    vehiculeId: number;
    conducteurId: number;
    startDate: string;
    endDate: string;
    type: "JOUR" | "HEBDO" | "MENSUEL" | "ANNUEL";
    note?: string;
}) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    // Vérifie le chevauchement
    const overlap = await prisma.planification.findFirst({
        where: {
            vehiculeId: data.vehiculeId,
            AND: [
                { startDate: { lt: end } },
                { endDate: { gt: start } },
            ],
        },
    });

    if (overlap) {
        throw new Error("Ce véhicule est déjà attribué sur cette période.");
    }

    return prisma.planification.create({ data });
}