import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    const emails = await prisma.email.findMany();
    return NextResponse.json(emails);
}

export async function POST(req: Request) {
    const { email } = await req.json();
    const created = await prisma.email.create({ data: { email } });
    return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    await prisma.email.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
    const { id, email } = await req.json();
    const updated = await prisma.email.update({
        where: { id },
        data: { email },
    });
    return NextResponse.json(updated);
}