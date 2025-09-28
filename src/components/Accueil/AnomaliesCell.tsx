"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {ToggleButton} from "@/components/ui/ToggleButton";

interface AnomaliesCellProps {
    anomalies?: string[] | null;
    isEditing?: boolean;
    onRemove?: (index: number) => void;
}

export function AnomaliesCell({ anomalies = [], isEditing, onRemove }: AnomaliesCellProps) {
    const list = Array.from(new Set(anomalies ?? []));
    const [expanded, setExpanded] = useState(false);

    // Limite l’affichage à 2 lignes si non expand
    const visibleList = expanded ? list : list.slice(0, 2);

    return (
        <div className="max-w-[200px]">
            <div
                className={`flex flex-wrap gap-1 overflow-y-auto transition-all duration-200 ${
                    !expanded ? "max-h-14" : "max-h-64"
                }`}
            >
                {visibleList.map((a, i) => (
                    <span
                        key={i}
                        className="flex items-center justify-between bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-md shadow-sm"
                    >
            <span className="truncate max-w-[140px] block">{a}</span>
                        {isEditing && onRemove && (
                            <button
                                onClick={() => onRemove(i)}
                                className="ml-1 text-red-500 hover:text-red-700"
                                aria-label={`Supprimer anomalie ${i}`}
                            >
                                <X size={12} />
                            </button>
                        )}
          </span>
                ))}
            </div>

            {/* ToggleButton si plus de 2 anomalies */}
            {list.length > 2 && (
                <div className="mt-1">
                    <ToggleButton expanded={expanded} setExpanded={setExpanded} />
                </div>
            )}
        </div>
    );
}