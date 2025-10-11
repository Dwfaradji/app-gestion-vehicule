import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  try {
    const conducteurs = await prisma.conducteur.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(conducteurs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible de récupérer les conducteurs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nom, prenom } = await req.json();
    if (!nom || !prenom)
      return NextResponse.json({ error: "Nom et prénom requis" }, { status: 400 });

    let code: string;
    let exists = true;
    do {
      code = generateCode();
      const check = await prisma.conducteur.findUnique({ where: { code } });
      exists = !!check;
    } while (exists);

    const conducteur = await prisma.conducteur.create({
      data: { nom, prenom, code },
    });
    return NextResponse.json(conducteur);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible de créer le conducteur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, nom, prenom } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const conducteur = await prisma.conducteur.update({
      where: { id },
      data: { nom, prenom },
    });
    return NextResponse.json(conducteur);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le conducteur" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    await prisma.conducteur.delete({ where: { id } });
    return NextResponse.json({ message: "Conducteur supprimé" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Impossible de supprimer le conducteur" }, { status: 500 });
  }
}
