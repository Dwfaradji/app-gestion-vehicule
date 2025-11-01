import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const parametres = await prisma.entretienParam.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(parametres);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // On ne transmet jamais l'id pour laisser Prisma gérer l'autoincrément
    const param = await prisma.entretienParam.create({
      data: {
        type: data.type ?? "AUTRE",
        category: data.category ?? "AUTRE",
        subCategory: data.subCategory ?? "AUTRE", // si vide, on remplace par "AUTRE"
        seuilKm: data.seuilKm ?? 0,
        alertKmBefore: data.alertKmBefore ?? 0,
      },
    });

    return NextResponse.json(param, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.entretienParam.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const data = await req.json();
  const { id, type, category, subCategory, seuilKm, alertKmBefore } = data;
  const updated = await prisma.entretienParam.update({
    where: { id },
    data: {
      type,
      category,
      subCategory,
      seuilKm,
      alertKmBefore,
    },
  });

  return NextResponse.json(updated);
}
