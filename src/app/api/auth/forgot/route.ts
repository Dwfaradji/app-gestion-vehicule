import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/mail"; // tu peux utiliser nodemailer ou un service mail

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // On ne dit pas que l'email n'existe pas pour éviter les fuites
        return NextResponse.json({ ok: true });
    }

    // Génération du token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1h

    await prisma.user.update({
        where: { email },
        data: { resetToken: token, resetTokenExpiry: expiry },
    });

    // Envoi de l’email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset/${token}`;
    await sendEmail(email, "Réinitialisation de mot de passe", `Cliquez ici pour réinitialiser votre mot de passe : ${resetUrl}`);

    return NextResponse.json({ ok: true });
}