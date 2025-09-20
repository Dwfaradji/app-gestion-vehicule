// src/app/api/notifications/vehicle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

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