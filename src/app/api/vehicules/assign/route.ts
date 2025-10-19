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

// export async function POST(req: Request) {
//     try {
//         const data = await req.json();
//         const { vehiculeId, conducteurId, startDate, endDate, type, nbreTranches } = data;
//
//         if (!vehiculeId || !conducteurId || !startDate || !endDate || !type || !nbreTranches) {
//             return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
//         }
//
//         // 1️⃣ Crée la planification
//         const planif = await prisma.planification.create({
//             data: {
//                 vehiculeId,
//                 conducteurId,
//                 startDate: new Date(startDate),
//                 endDate: new Date(endDate),
//                 type,
//                 nbreTranches,
//             },
//         });
//
//         // 2️⃣ Crée automatiquement les trajets
//         const trajetsToCreate = [];
//         for (let i = 0; i < nbreTranches * 2; i++) { // aller/retour -> *2
//             trajetsToCreate.push({
//                 vehiculeId,
//                 conducteurId,
//                 kmDepart: 0,      // tu peux récupérer km actuel du véhicule si besoin
//                 carburant: 100,   // par défaut
//                 destination: "A définir",
//                 planificationId: planif.id,
//             });
//         }
//
//         const trajets = await prisma.trajet.createMany({
//             data: trajetsToCreate,
//         });
//
//         return NextResponse.json({ planif, trajets }, { status: 201 });
//
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ error: "Erreur lors de la création de la planification" }, { status: 500 });
//     }
// }
