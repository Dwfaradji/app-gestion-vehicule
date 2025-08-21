import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// 📌 Récupérer toutes les dépenses ou par vehiculeId
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const vehiculeId = searchParams.get("vehiculeId");

    try {
        if (vehiculeId) {
            const depenses = await prisma.depense.findMany({
                where: { vehiculeId: Number(vehiculeId) },
                orderBy: { date: "desc" },
            });
            return NextResponse.json(depenses);
        }

        const depenses = await prisma.depense.findMany({
            orderBy: { date: "desc" },
        });
        return NextResponse.json(depenses);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 📌 Créer une dépense
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const depense = await prisma.depense.create({
            data: {
                vehiculeId: body.vehiculeId,
                categorie: body.categorie,
                montant: body.montant,
                description: body.description || "",
                date: new Date(body.date),
            },
        });

        return NextResponse.json(depense, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 📌 Supprimer une dépense
export async function DELETE(req: Request) {
    try {
        const body = await req.json();

        await prisma.depense.delete({
            where: { id: body.id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}