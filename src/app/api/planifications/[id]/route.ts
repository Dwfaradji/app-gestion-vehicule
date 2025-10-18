import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT — met à jour une planif
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id);
    const body = await req.json();
    const updated = await prisma.planification.update({
        where: { id },
        data: body,
    });
    return NextResponse.json(updated);
}

// DELETE — supprime une planif
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id);
    await prisma.planification.delete({ where: { id } });
    return NextResponse.json({ success: true });
}