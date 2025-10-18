import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPlanification } from "@/lib/planifications";

// GET — liste toutes les planifications
export async function GET() {
    const planifs = await prisma.planification.findMany({
        include: { vehicule: true, conducteur: true },
        orderBy: { startDate: "desc" },
    });
    return NextResponse.json(planifs);
}

// POST — crée une nouvelle planification
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const created = await createPlanification(body);
        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}