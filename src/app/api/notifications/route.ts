import { broadcastNotification, broadcastRefresh } from "@/lib/sse";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { date: "asc" },
    });

    // ✅ Convertir createdAt et date en string pour SSE et JSON
    const normalized = notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
      date: n.date ? n.date.toISOString() : null,
    }));

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("GET all notifications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.vehicleId) return NextResponse.json({ error: "vehicleId missing" }, { status: 400 });

    // 🔹 Créer notification
    const notif = await prisma.notification.create({ data: { ...data } });

    // ✅ Normaliser les dates avant SSE
    const normalizedNotif = {
      ...notif,
      createdAt: notif.createdAt.toISOString(),
      date: notif.date ? notif.date.toISOString() : null,
    };

    broadcastNotification(normalizedNotif);
    broadcastRefresh(notif.vehicleId);

    return NextResponse.json(normalizedNotif);
  } catch (err) {
    console.error("POST /notifications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
