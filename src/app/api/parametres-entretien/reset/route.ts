import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";
import { maintenanceParams } from "@/data/maintenanceParams";

export async function POST() {
  try {
    // Supprimer tous les paramètres existants
    await prisma.entretienParam.deleteMany();

    // Insérer les paramètres de maintenance par défaut
    const created = await prisma.entretienParam.createMany({
      data: maintenanceParams.map((p) => ({
        type: p.type,
        itemId: p.itemId,
        category: p.category,
        subCategory: p.subCategory ?? "",
        seuilKm: p.seuilKm,
        alertKmBefore: p.alertKmBefore ?? 0,
      })),
    });

    return NextResponse.json({ created: created.count });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}
