"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTrajets } from "@/context/trajetsContext";

interface ActionBarProps {
    setAttribuerOpen: (open: boolean) => void;
    filteredCount?: number;
}

export default function ActionBar({ setAttribuerOpen, filteredCount = 0 }: ActionBarProps) {
    const [clicked, setClicked] = useState(false);
    const { refreshAll, loading } = useTrajets();

    const handleClick = async () => {
        if (loading) return; // empêche de cliquer pendant le chargement
        setClicked(true);
        try {
            await refreshAll(); // rafraîchit uniquement le state
        } finally {
            setTimeout(() => setClicked(false), 1500); // animation visible 1.5s
        }
    };

    return (
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">

            {/* Bouton attribuer */}
            <button
                onClick={() => setAttribuerOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600
                           hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2
                           rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95"
            >
                + Attribuer un véhicule
            </button>

            {/* Bouton refresh */}
            <button
                onClick={handleClick}
                className={`relative flex items-center gap-2 bg-gray-100 hover:bg-gray-200 
                           text-gray-800 font-medium px-4 py-2 rounded-xl shadow-sm transition-transform transform
                           ${clicked ? "scale-95" : "hover:scale-105"}`}
                disabled={loading}
            >
                <RefreshCw
                    className={`w-5 h-5 transition-transform duration-700 
                               ${clicked || loading ? "animate-spin" : ""}`}
                />
                {loading ? "Chargement..." : "Refresh"}

                {filteredCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center
                                     px-2 py-1 text-xs font-bold leading-none text-white
                                     bg-red-600 rounded-full shadow animate-pulse">
                        {filteredCount}
                    </span>
                )}
            </button>
        </div>
    );
}