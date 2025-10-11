import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { broadcastRefresh } from "@/lib/sse";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Notification id missing" }, { status: 400 });

    const notif = await prisma.notification.update({
      where: { id },
      data: { seen: true },
    });

    broadcastRefresh(notif.vehicleId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("markAsRead error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
