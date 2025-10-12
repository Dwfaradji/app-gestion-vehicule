"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cards, { CardProps } from "@/components/ui/Cards";

interface TotauxProps {
    stats: CardProps[];
    openLabel?: string;   // texte quand le tableau est fermé
    closeLabel?: string;  // texte quand le tableau est ouvert
}

export default function Totaux({
                                   stats,
                                   openLabel = "Afficher les totaux véhicules",
                                   closeLabel = "Réduire le tableau de bord",
                               }: TotauxProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 w-full z-50">
            {/* Toggle */}
            <div className="flex justify-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-md shadow-md border border-gray-200 rounded-t-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                    {isOpen ? (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            <span>{closeLabel}</span>
                        </>
                    ) : (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            <span>{openLabel}</span>
                        </>
                    )}
                </button>
            </div>

            {/* Animated content */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] p-4"
                    >
                        <div className="max-w-7xl mx-auto">
                            <Cards cards={stats} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}