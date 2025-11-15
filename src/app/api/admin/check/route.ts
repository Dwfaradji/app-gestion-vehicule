import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    return new Response(JSON.stringify({ adminCount }), { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return new Response(JSON.stringify({ adminCount: 0 }), { status: 500 });
    }
  }
}
