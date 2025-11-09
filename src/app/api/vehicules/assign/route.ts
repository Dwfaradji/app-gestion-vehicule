import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Lorsqu’un véhicule est attribué à un conducteur,
export async function POST(req: Request) {
  try {
    const { vehiculeId, conducteurId, planificationId } = await req.json();

    if (!vehiculeId || !conducteurId) {
      return NextResponse.json(
        { error: "vehiculeId et conducteurId sont requis" },
        { status: 400 },
      );
    }

    // 1️⃣ Assigner le conducteur au véhicule
    const vehicule = await prisma.vehicule.update({
      where: { id: vehiculeId },
      data: { conducteurId },
    });
    // 2️⃣ Créer automatiquement un trajet lié
    const trajet = await prisma.trajet.create({
      data: {
        vehiculeId,
        conducteurId,
        planificationId,
        kmDepart: vehicule.km ?? 0,
        carburant: 0,
        destination: "A définir",
      },
      include: { vehicule: true, conducteur: true },
    });

    return NextResponse.json(
      { message: "Véhicule assigné et trajet créé", vehicule, trajet },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur POST /vehicules/assign:", error);
    return NextResponse.json(
      { error: "Erreur lors de l’assignation du véhicule" },
      { status: 500 },
    );
  }
}

