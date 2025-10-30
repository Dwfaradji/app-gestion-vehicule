import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET vacances (optionnel par entrepriseId ou sectionId)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const entrepriseId = url.searchParams.get("entrepriseId");
  const sectionId = url.searchParams.get("sectionId");

  const vacances = await prisma.vacances.findMany({
    where: {
      entrepriseId: entrepriseId ? Number(entrepriseId) : undefined,
      sectionId: sectionId ? Number(sectionId) : undefined,
    },
    orderBy: { id: "asc" }, // gérer par ordre de création
  });
  return NextResponse.json(vacances);
}

// POST créer vacances
export async function POST(req: Request) {
  const data = await req.json();
  const vacances = await prisma.vacances.create({
    data: {
      debut: new Date(data.debut),
      fin: new Date(data.fin),
      description: data.description,
      sectionId: data.sectionId || null,
      entrepriseId: data.entrepriseId || null,
    },
  });
  return NextResponse.json(vacances);
}

// PUT update vacances
export async function PUT(req: Request) {
  const { data, id } = await req.json();
  const vacances = await prisma.vacances.update({
    where: { id: Number(id) },
    data: {
      debut: new Date(data.debut),
      fin: new Date(data.fin),
      description: data.description,
    },
  });
  return NextResponse.json(vacances);
}

// DELETE vacances
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.vacances.delete({ where: { id: Number(id) } });
  return NextResponse.json({ deletedId: id });
}
