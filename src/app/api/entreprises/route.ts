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
export async function PUT(req: Request) {
  const { id, data } = await req.json();
  const { nom, adresse, ville, codePostal, pays, email, telephone, siret } = data;
  const entreprise = await prisma.entreprise.update({
    where: { id: Number(id) },
    data: { nom, adresse, ville, codePostal, pays, email, telephone, siret },
  });
  return NextResponse.json(entreprise);
}

// DELETE entreprise
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.entreprise.delete({ where: { id: Number(id) } });
  return NextResponse.json({ deletedId: id });
}

