import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { broadcastRefresh } from "@/lib/sse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const id = Number(body.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Notification id missing or invalid" }, { status: 400 });
    }

    // Vérifie que la notification existe avant update
    const notifExists = await prisma.notification.findUnique({ where: { id } });
    if (!notifExists) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

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
