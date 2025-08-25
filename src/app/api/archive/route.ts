import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import path from "path";

import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
export async function GET() {
    const vehicules = await prisma.vehicule.findMany();
    const utilisateurs = await prisma.user.findMany();
    const depenses = await prisma.depense.findMany();

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = new PassThrough();

    // Charger la police Roboto depuis public/fonts
    const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
    doc.font(fontPath);

    // Titre
    doc.fontSize(20).text("Archivage des données", { align: "center" });
    doc.moveDown();

    // Exemple tableau Véhicules
    doc.fontSize(14).text("Véhicules", { underline: true });
    vehicules.forEach(v => {
        doc.fontSize(12).text(`- ${v.nom} (${v.marque})`);
    });
    doc.addPage();

    // Exemple tableau Utilisateurs
    doc.fontSize(14).text("Utilisateurs", { underline: true });
    utilisateurs.forEach(u => {
        doc.fontSize(12).text(`- ${u.name} (${u.email})`);
    });
    doc.addPage();

    // Exemple tableau Dépenses
    doc.fontSize(14).text("Dépenses", { underline: true });
    depenses.forEach(d => {
        doc.fontSize(12).text(`- ${d.nom}: ${d.montant}€`);
    });

    doc.end();
    doc.pipe(stream);

    return new Response(stream, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="archive.pdf"',
        },
    });
}