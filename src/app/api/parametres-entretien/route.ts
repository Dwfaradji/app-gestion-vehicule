import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    const parametres = await prisma.entretienParam.findMany();
    return NextResponse.json(parametres);
}

export async function POST(req: Request) {
    const data = await req.json();
    console.log(data)
    const param = await prisma.entretienParam.create({ data });
    return NextResponse.json(param, { status: 201 });
}

// export async function POST(req: Request) {
//     const body = await req.json();
//
//     const newVehicule = await prisma.vehicule.create({
//         data: {
//             ...body,
//             dateEntretien: body.dateEntretien ? new Date(body.dateEntretien) : null,
//             prochaineRevision: body.prochaineRevision ? new Date(body.prochaineRevision) : null,
//             ctValidite: body.ctValidite ? new Date(body.ctValidite) : null,
//         },
//     });
//
//     return NextResponse.json(newVehicule, { status: 201 });
// }
//
//



export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.entretienParam.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
    const { id, ...data } = await req.json();
    const updated = await prisma.entretienParam.update({
        where: { id },
        data,
    });
    return NextResponse.json(updated);
}