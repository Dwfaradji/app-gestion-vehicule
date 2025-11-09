import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Récupérer le token JWT
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = Number(token.sub);

      console.log(token,"TOKEN")
    if (!userId) {
      return NextResponse.json({ error: "ID utilisateur manquant dans le token" }, { status: 401 });
    }

    // 2️⃣ Récupérer le body JSON
    const { nom, fonction, email, password } = await req.json();
    if (!nom || !fonction || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // 3️⃣ Vérifier que c’est bien la première connexion
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    if (!user.mustChangePassword) {
      return NextResponse.json({ error: "Vous avez déjà configuré votre compte" }, { status: 403 });
    }

    // 4️⃣ Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Mise à jour de l’admin
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: nom,
        fonction,
        email,
        passwordHash: hashedPassword,
        mustChangePassword: false, // Supprime le flag première connexion
      },
    });

    return NextResponse.json({ message: "Identifiants mis à jour", user: updatedUser });
  } catch (error) {
    console.error("Erreur update-credentials:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
