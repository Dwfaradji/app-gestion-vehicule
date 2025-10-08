import PDFDocument from "pdfkit";
import { PrismaClient } from "@/generated/prisma";
import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

/** 🧮 Calcule la largeur optimale de chaque colonne */
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

/** ✏️ Dessine un tableau dynamique */
function drawTable(doc: PDFKit.PDFDocument, headers: string[], rows: string[][], startY: number) {
    const startX = 50;
    const rowHeight = 25;
    let y = startY;

    const colWidths = computeColWidths(doc, headers, rows, doc.page.width - 2 * startX);

    // En-têtes
    doc.fontSize(12).fillColor("white");
    headers.forEach((header, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(x, y, colWidths[i], rowHeight).fillAndStroke("#1E40AF", "#000");
        doc.fillColor("white").text(header, x + 5, y + 7, { width: colWidths[i] - 10 });
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
            doc.fillColor("black").text(cell ?? "", x + 5, y + 7, { width: colWidths[i] - 10 });
        });

        y += rowHeight;
    });

    return y + 10;
}

/** 🧩 Fonction générique pour générer des données dynamiques selon le type */
async function getDataForExport(type: string) {
    switch (type) {
        case "vehicules": {
            const vehicules = await prisma.vehicule.findMany();
            return {
                title: "Véhicules",
                headers: ["Type", "Immatriculation", "Energie", "Km"],
                rows: vehicules.map(v => [
                    v.type ?? "",
                    v.immat ?? "",
                    v.energie ?? "",
                    v.km?.toString() ?? "0",
                ]),
            };
        }

        case "trajets": {
            const trajets = await prisma.trajet.findMany({
                include: { conducteur: true, vehicule: true },
            });
            return {
                title: "Trajets",
                headers: ["Véhicule", "Conducteur", "Destination", "Km Départ", "Km Arrivée", "Carburant", "Date"],
                rows: trajets.map(t => [
                    t.vehicule?.immat ?? "-",
                    t.conducteur ? `${t.conducteur.prenom} ${t.conducteur.nom}` : "-",
                    t.destination ?? "-",
                    t.kmDepart?.toString() ?? "-",
                    t.kmArrivee?.toString() ?? "-",
                    `${t.carburant ?? 0}%`,
                    t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-",
                ]),
            };
        }

        case "utilisateurs": {
            const utilisateurs = await prisma.user.findMany();
            return {
                title: "Utilisateurs",
                headers: ["Nom", "Email", "Rôle", "Statut"],
                rows: utilisateurs.map(u => [u.name ?? "", u.email ?? "", u.role ?? "", u.status ?? ""]),
            };
        }

        case "depenses": {
            const depenses = await prisma.depense.findMany({
                include: { vehicule: true },
            });
            return {
                title: "Dépenses",
                headers: ["Véhicule", "Catégorie", "Montant", "Date"],
                rows: depenses.map(d => [
                    d.vehicule?.immat ?? "-",
                    d.categorie ?? "-",
                    `${d.montant} €`,
                    d.date ? new Date(d.date).toLocaleDateString() : "-",
                ]),
            };
        }

        default:
            throw new Error(`Type d'export inconnu : ${type}`);
    }
}

/** 📄 Route réutilisable : /api/archive?type=trajets */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "vehicules";

        const { title, headers, rows } = await getDataForExport(type);

        const fontPath = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
        if (!fs.existsSync(fontPath)) throw new Error("Police Roboto introuvable !");

        const doc = new PDFDocument({ size: "A4", margin: 50, font: fontPath });
        const chunks: Buffer[] = [];
        doc.on("data", chunk => chunks.push(chunk));

        // En-tête du document
        doc.fontSize(24).fillColor("#1E40AF").text(`Export ${title}`, { align: "center" });
        doc.moveDown(1);

        drawTable(doc, headers, rows, doc.y);
        doc.end();

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });

        return new Response(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${type}_archive.pdf"`,
            },
        });
    } catch (err: any) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}