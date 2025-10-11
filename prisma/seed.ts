import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
}

main().finally(() => prisma.$disconnect());
