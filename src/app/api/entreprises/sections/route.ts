import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET toutes les sections ou par entrepriseId
export async function GET(req: Request) {
    const url = new URL(req.url);
    const entrepriseId = url.searchParams.get("entrepriseId");

    const sections = await prisma.section.findMany({
        where: entrepriseId ? { entrepriseId: Number(entrepriseId) } : {},
        include: { horaire: true, vacances: true },
    });
    return NextResponse.json(sections);
}

// POST créer section
export async function POST(req: Request) {
    const data = await req.json();
    const section = await prisma.section.create({ data });
    return NextResponse.json(section);
}

// PUT update section
export async function PUT(req: Request) {
    const {data,id} = await req.json();
    const section = await prisma.section.update({
        where: { id: Number(id) },
        data,
    });
    return NextResponse.json(section);
}

// DELETE section (cascade sur horaires et vacances)
export async function DELETE(req: Request) {
    const {id} = await req.json();
    await prisma.section.delete({ where: { id: Number(id) } });
    return NextResponse.json({ deletedId: id });
}