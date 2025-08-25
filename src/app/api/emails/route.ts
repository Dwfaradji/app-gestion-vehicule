import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!data.adresse) return new Response("Adresse e-mail requise", { status: 400 });

        const email = await prisma.email.create({
            data: { adresse: data.adresse },
        });

        return new Response(JSON.stringify(email), { status: 201 });
    } catch (err: any) {
        if (err.code === "P2002") return new Response("Adresse déjà existante", { status: 409 });
        console.error(err);
        return new Response("Erreur serveur", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const emails = await prisma.email.findMany();
        return new Response(JSON.stringify(emails), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response("Erreur serveur", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = Number(searchParams.get("id"));
        if (!id) return new Response("ID requis", { status: 400 });

        const data = await req.json();
        const email = await prisma.email.update({
            where: { id },
            data: { adresse: data.adresse },
        });

        return new Response(JSON.stringify(email), { status: 200 });
    } catch (err: any) {
        if (err.code === "P2002") return new Response("Adresse déjà existante", { status: 409 });
        console.error(err);
        return new Response("Erreur serveur", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    try {
        if (!id) return new Response("ID requis", { status: 400 });

        await prisma.email.delete({ where: { id } });
        return new Response("Supprimé avec succès", { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response("Erreur serveur", { status: 500 });
    }
}