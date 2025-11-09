import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT — mettre à jour une planification par id
export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const idStr = url.pathname.split('/').pop();
    const id = Number(idStr);
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const data = await req.json();

    // On limite aux champs pertinents, les valeurs undefined ne modifient pas
    const updated = await prisma.planification.update({
      where: { id },
      data: {
        vehiculeId: data.vehiculeId ?? undefined,
        conducteurId: data.conducteurId ?? undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        note: data.note ?? undefined,
        nbreTranches: data.nbreTranches ?? undefined,
      },
      include: { vehicule: true, conducteur: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Erreur PUT /planifications/[id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE — supprimer une planification par id
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const idStr = url.pathname.split('/').pop();
    const id = Number(idStr);
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    await prisma.planification.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Erreur DELETE /planifications/[id]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
