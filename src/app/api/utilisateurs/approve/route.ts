import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return NextResponse.json(updated);
}
