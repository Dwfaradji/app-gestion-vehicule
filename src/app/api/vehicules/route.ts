
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();




// GET → retourne tous les véhicules
export async function GET() {
    const vehicules = await prisma.vehicule.findMany();
    return NextResponse.json(vehicules);
}

// POST → ajoute un véhicule
export async function POST(req: Request) {
    const body = await req.json();

    const newVehicule = await prisma.vehicule.create({
        data: {
            ...body,
            dateEntretien: body.dateEntretien ? new Date(body.dateEntretien) : null,
            prochaineRevision: body.prochaineRevision ? new Date(body.prochaineRevision) : null,
            ctValidite: body.ctValidite ? new Date(body.ctValidite) : null,
        },
    });

    return NextResponse.json(newVehicule, { status: 201 });
}

// DELETE → supprime un véhicule par ID
export async function DELETE(req: Request) {
    const { id } = await req.json();

    // Supprimer toutes les dépenses liées
    await prisma.depense.deleteMany({
        where: { vehiculeId: id },
    });

    // Supprimer le véhicule
    await prisma.vehicule.delete({ where: { id } });

    return NextResponse.json({ success: true });
}

// PUT → met à jour un véhicule
export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();

        // 🔹 Récupération du véhicule actuel
        const vehicule = await prisma.vehicule.findUnique({ where: { id } });
        if (!vehicule) {
            return NextResponse.json({ error: "Véhicule introuvable" }, { status: 404 });
        }

        // 🔹 Vérification km : ne peut pas être inférieur
        if (data.km !== undefined && data.km < vehicule.km) {
            return NextResponse.json(
                { error: "Le kilométrage ne peut pas être inférieur au précédent" },
                { status: 400 }
            );
        }

        // 🔹 Merge partiel : seuls les champs définis sont mis à jour
        const filteredData: Record<string, any> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                filteredData[key] = value;
            }
        });

        // 🔹 Conversion des dates si présentes
        if (filteredData.dateEntretien) filteredData.dateEntretien = new Date(filteredData.dateEntretien);
        if (filteredData.prochaineRevision) filteredData.prochaineRevision = new Date(filteredData.prochaineRevision);
        if (filteredData.ctValidite) filteredData.ctValidite = new Date(filteredData.ctValidite);

        const updated = await prisma.vehicule.update({
            where: { id },
            data: filteredData,
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}