import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// ✅ GET tous les trajets
export async function GET() {
    try {
        const trajets = await prisma.trajet.findMany({
            include: { vehicule: true, conducteur: true },
            orderBy: { id: "desc" },
        });
        return NextResponse.json(trajets);
    } catch (error) {
        console.error("Erreur GET /trajets:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// ✅ POST ajouter un trajet
export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!data.vehiculeId || data.carburant == null) {
            return NextResponse.json({ error: "vehiculeId et carburant requis" }, { status: 400 });
        }

        const newTrajet = await prisma.trajet.create({
            data: {
                vehiculeId: data.vehiculeId,
                conducteurId: data.conducteurId || null,
                kmDepart: data.kmDepart || null,
                kmArrivee: data.kmArrivee || null,
                heureDepart: data.heureDepart || null,
                heureArrivee: data.heureArrivee || null,
                destination: data.destination || null,
                carburant: data.carburant,
                anomalies: data.anomalies || [], // <-- tableau JSON
                createdAt: data.date ? new Date(data.date) : new Date(),
            },
            include: { vehicule: true, conducteur: true },
        });

        return NextResponse.json(newTrajet, { status: 201 });
    } catch (error) {
        console.error("Erreur POST /trajets:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// ✅ PUT modifier un trajet
export async function PUT(req: Request) {
    try {
        const data = await req.json();
        if (!data.id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

        const updatedTrajet = await prisma.trajet.update({
            where: { id: data.id },
            data: {
                vehiculeId: data.vehiculeId,
                conducteurId: data.conducteurId,
                kmDepart: data.kmDepart,
                kmArrivee: data.kmArrivee,
                heureDepart: data.heureDepart,
                heureArrivee: data.heureArrivee,
                destination: data.destination,
                carburant: data.carburant,
                anomalies: data.anomalies || [], // <-- tableau JSON
                createdAt: data.date ? new Date(data.date) : undefined,
            },
            include: { vehicule: true, conducteur: true },
        });

        return NextResponse.json(updatedTrajet);
    } catch (error) {
        console.error("Erreur PUT /trajets:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// ✅ DELETE supprimer un trajet
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

        await prisma.trajet.delete({ where: { id } });
        return NextResponse.json({ message: "Trajet supprimé" });
    } catch (error) {
        console.error("Erreur DELETE /trajets:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}