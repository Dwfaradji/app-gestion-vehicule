// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { broadcastNotification, broadcastRemoveNotification, broadcastRefresh } from "./stream/route";

const prisma = new PrismaClient();



export async function GET() {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { date: "asc" },
        });
        return NextResponse.json(notifications);
    } catch (err) {
        console.error("GET all notifications error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        if (!data.vehicleId) return NextResponse.json({ error: "vehicleId missing" }, { status: 400 });

        // 🔹 Créer notification sans passer d'ID
        const notif = await prisma.notification.create({ data: { ...data } });
        broadcastNotification(notif);
        broadcastRefresh(notif.vehicleId);

        return NextResponse.json(notif);
    } catch (err) {
        console.error("POST /notifications error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        const notif = await prisma.notification.findUnique({ where: { id } });
        if (!notif) return NextResponse.json({ error: "Notification not found" }, { status: 404 });

        await prisma.notification.deleteMany({ where: { id } });
        broadcastRemoveNotification(notif.itemId ?? 0, notif.vehicleId, notif.type);
        broadcastRefresh(notif.vehicleId);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE /notifications error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}