import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { broadcastRemoveNotification, broadcastNotification } from "../stream/route";
import { generateAllNotifications } from "@/utils/generateAllNotifications";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { vehicleId } = await req.json();
        if (!vehicleId) return NextResponse.json({ error: "vehicleId missing" }, { status: 400 });

        const vehicle = await prisma.vehicule.findUnique({ where: { id: vehicleId }, include: { depense: true } });
        if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });

        const params = await prisma.entretienParam.findMany();
        const generated = generateAllNotifications([vehicle], params);
        const existing = await prisma.notification.findMany({ where: { vehicleId } });

        // 🔹 Supprimer notifications obsolètes
        for (const notif of existing) {
            const stillExists = generated.some(
                g => g.type === notif.type && g.vehicleId === notif.vehicleId && g.itemId === notif.itemId && g.message === notif.message
            );
            if (!stillExists) {
                await prisma.notification.deleteMany({ where: { id: notif.id } });
                broadcastRemoveNotification(notif.itemId ?? 0, notif.vehicleId, notif.type);
            }
        }

        // 🔹 Ajouter nouvelles notifications
        for (const g of generated) {
            const exists = existing.find(
                n => n.type === g.type && n.vehicleId === g.vehicleId && n.itemId === g.itemId && n.message === g.message
            );
            if (!exists) {
                const created = await prisma.notification.create({
                    data: {
                        type: g.type,
                        message: g.message,
                        vehicleId: g.vehicleId,
                        itemId: g.itemId,
                        priority: g.priority,
                        date: g.date,
                        km: g.km,
                        seen: g.seen,
                    },
                });
                broadcastNotification(created);
            }
        }

        const notifications = await prisma.notification.findMany({
            where: { vehicleId },
            orderBy: { date: "asc" },
        });

        return NextResponse.json({ success: true, notifications });
    } catch (err) {
        console.error("POST /notifications/refresh error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}