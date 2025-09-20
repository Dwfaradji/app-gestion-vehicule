// src/app/api/archive/route.ts
import PDFDocument from "pdfkit";
import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Calcul dynamique de la largeur des colonnes selon le texte le plus long
function computeColWidths(doc: PDFKit.PDFDocument, headers: string[], rows: string[][], maxWidth: number) {
    const colWidths = headers.map((h, i) => {
        let max = doc.widthOfString(h) + 10;
        rows.forEach(r => {
            const w = doc.widthOfString(r[i] ?? "") + 10;
            if (w > max) max = w;
        });
        return max;
    });

    const totalWidth = colWidths.reduce((a, b) => a + b, 0);
    if (totalWidth > maxWidth) {
        const scale = maxWidth / totalWidth;
        return colWidths.map(w => w * scale);
    }
    return colWidths;
}

// Dessiner un tableau avec adaptation des colonnes
function drawTable(doc: PDFKit.PDFDocument, headers: string[], rows: string[][], startY: number) {
    const startX = 50;
    const rowHeight = 25;
    let y = startY;

    const colWidths = computeColWidths(doc, headers, rows, doc.page.width - 2 * startX);

    // Entêtes
    doc.fontSize(12).fillColor("white");
    headers.forEach((header, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(x, y, colWidths[i], rowHeight).fillAndStroke("#1E40AF", "#000");
        doc.fillColor("white").text(header, x + 5, y + 7, { width: colWidths[i] - 10, align: "left" });
    });

    y += rowHeight;

    // Lignes
    rows.forEach((row, rowIndex) => {
        if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            y = doc.page.margins.top;
        }

        row.forEach((cell, i) => {
            const fillColor = rowIndex % 2 === 0 ? "#f3f4f6" : "#ffffff";
            const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
            doc.rect(x, y, colWidths[i], rowHeight).fillAndStroke(fillColor, "#000");
            doc.fillColor("black").text(cell ?? "", x + 5, y + 7, { width: colWidths[i] - 10, align: "left" });
        });

        y += rowHeight;
    });

    return y + 10;
}

export async function GET() {
    const vehicules = await prisma.vehicule.findMany();
    const utilisateurs = await prisma.user.findMany();
    const depenses = await prisma.depense.findMany();

    const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
    if (!fs.existsSync(fontPath)) throw new Error("Police Roboto introuvable !");

    const doc = new PDFDocument({ size: "A4", margin: 50, font: fontPath });

    // On stocke les chunks du PDF
    const chunks: Buffer[] = [];
    doc.on("data", chunk => chunks.push(chunk));

    // Page résumé
    doc.fontSize(24).fillColor("#1E40AF").text("Résumé des données", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(14).fillColor("#111827");
    doc.text(`Nombre de véhicules: ${vehicules.length}`);
    doc.text(`Nombre d'utilisateurs: ${utilisateurs.length}`);
    doc.text(`Nombre de dépenses: ${depenses.length}`);
    const totalDepense = depenses.reduce((a, b) => a + b.montant, 0);
    doc.text(`Total dépenses: ${totalDepense}€`);
    doc.addPage();

    // --- Véhicules ---
    doc.fontSize(18).fillColor("#111827").text("Véhicules", { underline: true });
    doc.moveDown(0.5);
    drawTable(
        doc,
        ["Type", "Immatriculation"],
        vehicules.map(v => [v.type ?? "", v.immat ?? ""]),
        doc.y
    );
    doc.addPage();

    // --- Utilisateurs ---
    doc.fontSize(18).text("Utilisateurs", { underline: true });
    doc.moveDown(0.5);
    drawTable(
        doc,
        ["Nom", "Email", "Rôle", "Statut"],
        utilisateurs.map(u => [u.name ?? "", u.email ?? "", u.role ?? "", u.status ?? ""]),
        doc.y
    );
    doc.addPage();

    // --- Dépenses ---
    doc.fontSize(18).text("Dépenses", { underline: true });
    doc.moveDown(0.5);
    drawTable(
        doc,
        ["Vehicule", "Categorie", "Montant", "Date"],
        depenses.map(d => [
            d.vehiculeId?.toString() ?? "",
            d.categorie ?? "",
            `${d.montant ?? 0}€`,
            d.date ? d.date.toISOString().split("T")[0] : "",
        ]),
        doc.y
    );

    doc.end();

    // On retourne un buffer au lieu du PassThrough
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
    });

    // @ts-ignore
    return new Response(pdfBuffer , {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="archive.pdf"',
        },
    });
}