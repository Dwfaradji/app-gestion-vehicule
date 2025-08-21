import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });
        }

        const passwordHash = await hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name: name ?? null,
                passwordHash,
                // Nouveau compte → en attente
                status: "PENDING",
                role: "USER",
            },
        });

        return NextResponse.json({ id: user.id, email: user.email, status: user.status }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}