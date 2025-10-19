import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ PUT — met à jour une planification
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ⚡️ Attente obligatoire
  const body = await req.json();

  try {
    const updated = await prisma.planification.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Erreur mise à jour planification:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// ✅ DELETE — supprime une planification
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ⚡️ Même correction ici

  try {
    await prisma.planification.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Planification supprimée" }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression planification:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
