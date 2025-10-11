// app/api/utilisateurs/password/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { hash, compare } from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const { id, actuel, nouveau } = await req.json();

    if (!id || !actuel || !nouveau) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    const ok = await compare(actuel, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });

    const passwordHash = await hash(nouveau, 12);
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return NextResponse.json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
