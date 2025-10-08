"use client";

import React, { useState } from "react";
import { FileDown } from "lucide-react";

export interface ArchiveButtonProps {
    /** URL ou endpoint d’exportation (ex: /api/archive-trajets) */
    endpoint: string;

    /** Nom du fichier exporté (ex: archive_trajets.pdf) */
    filename?: string;

    /** Texte du bouton (ex: "Exporter les trajets") */
    label?: string;

    /** Type de fichier (ex: pdf, csv, zip...) */
    fileType?: string;

    /** Classe CSS personnalisée */
    className?: string;

    /** Callback après téléchargement */
    onComplete?: () => void;
}

/**
 * 💾 Composant réutilisable pour exporter / archiver des données
 * Exemple :
 * <ArchiveButton endpoint="/api/archive-trajets" filename="trajets.pdf" label="Exporter trajets" />
 */
const ArchiveButton: React.FC<ArchiveButtonProps> = ({
                                                         endpoint,
                                                         filename = "archive.pdf",
                                                         label = "Archiver / Exporter",
                                                         fileType = "pdf",
                                                         className = "",
                                                         onComplete,
                                                     }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Erreur lors de la génération du fichier");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            onComplete?.();
        } catch (err: any) {
            alert(err.message || "Erreur lors du téléchargement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition 
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} ${className}`}
        >
            <FileDown size={16} />
            {loading ? "Génération en cours…" : label}
        </button>
    );
};

export default ArchiveButton;