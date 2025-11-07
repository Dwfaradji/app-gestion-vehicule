import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash(`${process.env.MDP_ADMIN}`, 10);

    await prisma.user.upsert({
        where: { email: process.env.USER_ADMIN },
        update: {},
        create: {
            email: `${process.env.USER_ADMIN}`,
            passwordHash: hashed,
            role: "ADMIN",
            mustChangePassword: true, // ✅ première connexion
            status: "APPROVED"
        },
    });

    console.log("Admin créé !");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });