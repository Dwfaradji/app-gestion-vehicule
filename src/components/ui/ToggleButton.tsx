"use client";

import { Plus, Minus } from "lucide-react";

interface ToggleButtonProps {
    expanded: boolean;
    setExpanded: (value: boolean) => void;
    className?: string; // optionnel pour ajouter des styles externes
}

export function ToggleButton({ expanded, setExpanded, className }: ToggleButtonProps) {
    return (
        <div className={`relative inline-block mt-2 group ${className || ""}`}>
            {!expanded ? (
                <button
                    onClick={() => setExpanded(true)}
                    className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                    aria-label="Afficher plus"
                >
                    <Plus size={14} className="text-blue-600" />
                </button>
            ) : (
                <button
                    onClick={() => setExpanded(false)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    aria-label="Réduire"
                >
                    <Minus size={14} className="text-gray-600" />
                </button>
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
          {!expanded ? "Afficher plus" : "Réduire"}
        </span>
            </div>
        </div>
    );
}