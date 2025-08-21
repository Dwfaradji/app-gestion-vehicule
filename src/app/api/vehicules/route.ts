
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET → retourne tous les véhicules
export async function GET() {
    const vehicules = await prisma.vehicule.findMany();
    return NextResponse.json(vehicules);
}

// POST → ajoute un véhicule
export async function POST(req: Request) {
    const body = await req.json();

    const newVehicule = await prisma.vehicule.create({
        data: {
            ...body,
            dateEntretien: body.dateEntretien ? new Date(body.dateEntretien) : null,
            prochaineRevision: body.prochaineRevision ? new Date(body.prochaineRevision) : null,
            ctValidite: body.ctValidite ? new Date(body.ctValidite) : null,
        },
    });

    return NextResponse.json(newVehicule, { status: 201 });
}

// DELETE → supprime un véhicule par ID
export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.vehicule.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

// PUT → met à jour un véhicule
export async function PUT(req: Request) {
    const { id, ...data } = await req.json();

    const updated = await prisma.vehicule.update({
        where: { id },
        data: {
            ...data,
            dateEntretien: data.dateEntretien ? new Date(data.dateEntretien) : null,
            prochaineRevision: data.prochaineRevision ? new Date(data.prochaineRevision) : null,
            ctValidite: data.ctValidite ? new Date(data.ctValidite) : null,
        },
    });

    return NextResponse.json(updated);
}