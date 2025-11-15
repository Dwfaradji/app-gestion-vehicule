import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const depenses = await prisma.depense.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(depenses);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
// 📌 Créer une dépense
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const depense = await prisma.depense.create({
      data: {
        vehiculeId: body.vehiculeId,
        itemId: body.itemId,
        categorie: body.categorie,
        montant: body.montant,
        note: body.note || "",
        reparation: body.reparation || null,
        km: body.km, // ✅ obligatoire
        date: body.date ? new Date(body.date) : new Date(), // fallback si vide
        intervenant: body.intervenant || "Pas d'intervenant",
      },
    });

    return NextResponse.json(depense, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur POST /depenses :", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Erreur POST /depenses :", error);
    return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
  }
}
// 📌 Supprimer une dépense
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await prisma.depense.deleteMany({
      where: { id: body.id, vehiculeId: body.vehiculeId },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur POST /depenses :", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("Erreur POST /depenses :", error);
    return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
  }
}
