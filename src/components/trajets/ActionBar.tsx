"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTrajets } from "@/context/trajetsContext";
import { Button } from "@/components/ui/Button";

interface ActionBarProps {
  setAttribuerOpen: (open: boolean) => void;
  filteredCount?: number;
}

export default function ActionBar({ setAttribuerOpen, filteredCount = 0 }: ActionBarProps) {
  const [clicked, setClicked] = useState(false);
  const { loading } = useTrajets();

  const handleClick = async () => {
    if (loading || clicked) return; // Empêche les clics répétés
    setClicked(true);
    try {
      // Simule un rafraîchissement ou une action asynchrone
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setClicked(false); // Réactive après 1s
    }
  };

  return (
    <div className="relative flex flex-wrap justify-between items-center gap-4">
      {/* Bouton d’attribution */}
      <Button
        variant="primary"
        onClick={() => setAttribuerOpen(true)}
        className="flex items-center gap-2"
      >
        + Attribuer un véhicule
      </Button>

      {/* Bouton refresh */}
      <Button
        variant="secondary"
        disabled={loading}
        onClick={handleClick}
        className="flex items-center gap-2"
        leftIcon={
          <RefreshCw
            className={`w-4 h-4 transition-transform duration-700 ${
              clicked || loading ? "animate-spin" : ""
            }`}
          />
        }
      >
        {loading ? "Chargement..." : "Refresh"}

        {/* Badge compteur — affiché uniquement si non cliqué */}
        {!clicked && filteredCount > 0 && (
          <span
            className="absolute -top-3 -right-2 inline-flex items-center justify-center
                       px-2 py-1 text-xs font-bold text-white
                       bg-red-500 rounded-full shadow animate-pulse z-50"
          >
            {filteredCount}
          </span>
        )}
      </Button>
    </div>
  );
}
