"use client";

import React, { useState } from "react";

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
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`rounded-lg px-4 py-2 text-sm font-medium text-white mb-3 ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Génération en cours…" : "Archiver / Exporter"}
      </button>
    </div>
  );
};

export default TabArchive;
