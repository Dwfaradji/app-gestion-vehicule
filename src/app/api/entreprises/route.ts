import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET toutes les entreprises
export async function GET() {
    const entreprises = await prisma.entreprise.findMany({
        include: { sections: true, vacances: true, horaire: true },
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
    const {data,id} = await req.json();
    const entreprise = await prisma.entreprise.update({
        where: { id: Number(id) },
        data,
    });
    return NextResponse.json(entreprise);
}

// DELETE entreprise
export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.entreprise.delete({ where: { id: Number(id) } });
    return NextResponse.json({ deletedId: id });
}