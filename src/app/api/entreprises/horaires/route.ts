import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET horaires (optionnel par entrepriseId ou sectionId)
//TODO a simplifier  entrepriseId et sectionId
export async function GET(req: Request) {
  const url = new URL(req.url);
  const entrepriseId = url.searchParams.get("entrepriseId");
  const sectionId = url.searchParams.get("sectionId");

  const horaires = await prisma.horaire.findMany({
    where: {
      entrepriseId: entrepriseId ? Number(entrepriseId) : undefined,
      sectionId: sectionId ? Number(sectionId) : undefined,
    },
    orderBy: { id: "asc" }, // gérer par ordre de création
  });
  return NextResponse.json(horaires);
}

// POST créer section
export async function POST(req: Request) {
  const data = await req.json();
  const section = await prisma.horaire.create({
    data: {
      ouverture: data.ouverture,
      fermeture: data.fermeture,
      entrepriseId: data.entrepriseId || null,
      sectionId: data.sectionId || null,
    },
  });
  return NextResponse.json(section);
}

export async function PUT(req: Request) {
  const { id, data } = await req.json();
  const vacances = await prisma.horaire.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(vacances);
}

// DELETE horaire
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.horaire.delete({ where: { id: Number(id) } });
  return NextResponse.json({ deletedId: id });
}
