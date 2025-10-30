import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET toutes les entreprises
export async function GET() {
  const entreprises = await prisma.entreprise.findMany({
    include: { sections: true, vacances: true, horaire: true },
    orderBy: { id: "asc" }, // gérer par ordre de création
  });
  return NextResponse.json(entreprises);
}

// POST créer entreprise
export async function POST(req: Request) {
  const data = await req.json();
  const entreprise = await prisma.entreprise.create({ data });
  return NextResponse.json(entreprise);
}

// PUT update entreprise
// export async function PUT(req: Request) {
//   const { id, data } = await req.json();
//   const entreprise = await prisma.entreprise.update({
//     where: { id: Number(id) },
//     data,
//   });
//   return NextResponse.json(entreprise);
// }

// DELETE entreprise
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.entreprise.delete({ where: { id: Number(id) } });
  return NextResponse.json({ deletedId: id });
}


// API PUT /api/entreprises
export async function PUT(req: Request) {
    const { id, data } = await req.json();

    // Mettre à jour uniquement les champs scalaires
    const { nom, adresse, ville, codePostal, pays, email, telephone, siret } = data;

    const entreprise = await prisma.entreprise.update({
        where: { id: Number(id) },
        data: { nom, adresse, ville, codePostal, pays, email, telephone, siret },
    });

    // Mettre à jour les horaires
    if (data.horaire) {
        if (data.horaire.id) {
            await prisma.horaire.update({
                where: { id: data.horaire.id },
                data: { ouverture: data.horaire.ouverture, fermeture: data.horaire.fermeture },
            });
        } else {
            await prisma.horaire.create({
                data: { ...data.horaire, entrepriseId: Number(id) },
            });
        }
    }

    // Mettre à jour les vacances de l'entreprise (pas celles des sections)
    for (const vac of data.vacances.filter((v: any) => !v.sectionId)) {
        if (vac.id) {
            await prisma.vacances.update({
                where: { id: vac.id },
                data: { description: vac.description, debut: vac.debut, fin: vac.fin },
            });
        } else {
            await prisma.vacances.create({
                data: { ...vac, entrepriseId: Number(id) },
            });
        }
    }

    return new Response(JSON.stringify(entreprise), { status: 200 });
}