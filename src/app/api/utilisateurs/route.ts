import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    const utilisateurs = await prisma.user.findMany();
    return NextResponse.json(utilisateurs);
}

// export async function POST(req: Request) {
//     const data = await req.json();
//     const utilisateur = await prisma.user.create({ data });
//     return NextResponse.json(utilisateur, { status: 201 });
// }

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
    const { id, ...data } = await req.json();
    const updated = await prisma.user.update({
        where: { id },
        data,
    });
    return NextResponse.json(updated);
}