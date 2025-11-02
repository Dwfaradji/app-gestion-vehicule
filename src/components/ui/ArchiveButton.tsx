"use client";

import React, { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface ArchiveButtonProps {
  /** URL ou endpoint d’exportation (ex: /api/archive-trajets) */
  endpoint: string;

  /** Nom du fichier exporté (ex: archive_trajets.pdf) */
  filename?: string;

  /** Texte du bouton (ex: "Exporter les trajets") */
  label?: string;

  /** Type de fichier (ex: pdf, csv, zip...) */
  fileType?: string;

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
  onComplete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) new Error("Erreur lors de la génération du fichier");

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
    <Button
      variant={"primary"}
      onClick={handleDownload}
      disabled={loading}
      leftIcon={<FileDown size={16} />}
      loading={loading}
      className={"w-full justify-start gap-4"}
    >
      {loading ? "En cours…" : label}
    </Button>
  );
};

export default ArchiveButton;
