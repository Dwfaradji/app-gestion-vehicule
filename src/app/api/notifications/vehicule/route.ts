import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { vehicleId } = await req.json();
    if (!vehicleId) return NextResponse.json({ error: "vehicleId missing" }, { status: 400 });

    const notifications = await prisma.notification.findMany({
      where: { vehicleId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("GET vehicle notifications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
