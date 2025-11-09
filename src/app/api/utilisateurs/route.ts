import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const utilisateurs = await prisma.user.findMany();
  return NextResponse.json(utilisateurs);
}

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
