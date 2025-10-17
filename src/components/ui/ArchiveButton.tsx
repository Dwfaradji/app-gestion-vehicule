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
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message || "Erreur lors du téléchargement");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold text-gray-800 transition-all
    ${
      loading
        ? "bg-gray-300 cursor-not-allowed shadow-inner"
        : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 active:from-gray-200 active:to-gray-300 shadow-md hover:scale-105"
    }
    focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 ${className}`}
    >
      <FileDown size={16} />
      {loading ? "Génération en cours…" : label}
    </button>
  );
};

export default ArchiveButton;
