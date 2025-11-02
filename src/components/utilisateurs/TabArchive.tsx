"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

const TabArchive = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/archive");
      if (!res.ok) new Error("Erreur lors de la génération du PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "archive.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message || "Erreur lors du téléchargement");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Archivage des données</h2>
      <Button
        variant="primary"
        onClick={handleDownload}
        disabled={loading}
        className={` ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
      >
        {loading ? "Génération en cours…" : "Archiver / Exporter"}
      </Button>
    </div>
  );
};

export default TabArchive;
