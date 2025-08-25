import { PrismaClient } from "@/generated/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name, fonction, email, password } = await req.json();

        if (!name || !fonction || !email || !password) {
            return NextResponse.json(
                { error: "Tous les champs sont requis" },
                { status: 400 }
            );
        }

        // Vérification si l'email existe déjà
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { error: "Un compte existe déjà avec cet email" },
                { status: 409 }
            );
        }

        // Hash du mot de passe
        const passwordHash = await hash(password, 12);
        console.log("Mot de passe brut :", password);
        console.log("Mot de passe hashé :", passwordHash);

        // Création utilisateur → stocke uniquement le hash
        const user = await prisma.user.create({
            data: {
                name,
                fonction,
                email,
                passwordHash,   // ✅ jamais le mot de passe en clair
                status: "PENDING",
                role: "USER",
            },
            select: {
                id: true,
                name: true,
                email: true,
                fonction: true,
                status: true,
                role: true,
            },
        });

        return NextResponse.json(
            {
                message: "Compte créé, en attente de validation",
                user,
            },
            { status: 201 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}