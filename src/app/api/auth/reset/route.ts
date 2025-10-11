import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password)
    return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
  });

  if (!user) return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 400 });

  const hashed = await hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashed, resetToken: null, resetTokenExpiry: null },
  });

  return NextResponse.json({ ok: true });
}
