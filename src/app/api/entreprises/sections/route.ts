import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET toutes les sections ou par entrepriseId
export async function GET(req: Request) {
  const url = new URL(req.url);
  const entrepriseId = url.searchParams.get("entrepriseId");

  const sections = await prisma.section.findMany({
    where: entrepriseId ? { entrepriseId: Number(entrepriseId) } : {},
    include: { horaire: true, vacances: true },
    orderBy: { id: "asc" }, // gérer par ordre de création
  });
  return NextResponse.json(sections);
}

// POST créer section
export async function POST(req: Request) {
  const data = await req.json();
  const section = await prisma.section.create({ data });
  return NextResponse.json(section);
}

// PUT update section
// export async function PUT(req: Request) {
//   const { data, id } = await req.json();
//   console.log(data, "data PUT section");
//   const section = await prisma.section.update({
//     where: { id: Number(id) },
//     data,
//   });
//   return NextResponse.json(section);
// }

// DELETE section (cascade sur horaires et vacances)
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.section.delete({ where: { id: Number(id) } });
  return NextResponse.json({ deletedId: id });
}


// API PUT /api/entreprises
export async function PUT(req: Request) {
    const { id, data } = await req.json();

    // Mettre à jour uniquement les champs scalaires
    const { nom, adresse, ville, codePostal, pays, email, telephone, siret } = data;

    const entreprise = await prisma.section.update({
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
