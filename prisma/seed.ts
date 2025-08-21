import { PrismaClient } from "@/generated/prisma";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
    const email = "admin@local.test";
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return;

    const passwordHash = await hash("Admin123!", 12);
    await prisma.user.create({
        data: {
            email,
            name: "Admin",
            role: "ADMIN",
            status: "APPROVED",
            passwordHash,
        },
    });
    console.log("Admin créé:", email, " / mot de passe: Admin123!");
}

main().finally(()=>prisma.$disconnect());