import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET horaires (optionnel par entrepriseId ou sectionId)
export async function GET(req: Request) {
    const url = new URL(req.url);
    const entrepriseId = url.searchParams.get("entrepriseId");
    const sectionId = url.searchParams.get("sectionId");

    const horaires = await prisma.horaire.findMany({
        where: {
            entrepriseId: entrepriseId ? Number(entrepriseId) : undefined,
            sectionId: sectionId ? Number(sectionId) : undefined,
        },
    });
    return NextResponse.json(horaires);
}

// PUT créer ou update horaire one-to-one
// export async function PUT(req: Request) {
//     const {data,parentType, parentId,id} = await req.json();
//     console.log(data,id,"data put");
//
//     const updateData: any = {};
//     if (parentType === "entreprise") updateData.entrepriseId = Number(parentId);
//     if (parentType === "section") updateData.sectionId = Number(parentId);
//
//     // upsert: créer si pas existant sinon update
//     const horaire = await prisma.horaire.upsert({
//         where:
//             parentType === "entreprise"
//                 ? { entrepriseId: Number(parentId) }
//                 : { sectionId: Number(parentId) },
//         update: data,
//         create: { ...data, ...updateData },
//     });
//
//     return NextResponse.json(horaire);
// }

// POST créer section
export async function POST(req: Request) {
    const {data,parentId,parentType} = await req.json();
    console.log({data:data, id: parentId, parentType: parentType},"Data id add horaire context");
    const section = await prisma.horaire.create({
        data:{
            ouverture: data.ouverture,
            fermeture: data.fermeture,
            entrepriseId: "entreprise" === parentType ? parentId : null,
            sectionId: "section" === parentType ? parentId :null
        } });
    console.log(section,"horaire");
    return NextResponse.json(section);
}





export async function PUT(req: Request) {
    const {data,id} = await req.json();
    const vacances = await prisma.horaire.update({
        where: { id: Number(id) },
        data,
    });
    return NextResponse.json(vacances);
}

// DELETE horaire
export async function DELETE(req: Request) {
    const { id } =await req.json();
    await prisma.horaire.delete({ where: { id: Number(id) } });
    return NextResponse.json({ deletedId: id });
}