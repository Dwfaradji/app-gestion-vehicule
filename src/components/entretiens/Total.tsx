"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cards, { CardProps } from "@/components/ui/Cards";

interface TotauxProps {
  stats: CardProps[];
  openLabel?: string;
  closeLabel?: string;
  batchSize?: number;
  preloadOffset?: number; // combien de px avant le bas pour précharger
}

export default function Totaux({
  stats,
  openLabel = "Afficher les totaux véhicules",
  closeLabel = "Réduire le tableau de bord",
  batchSize = 10,
  preloadOffset = 200,
}: TotauxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleStats, setVisibleStats] = useState<CardProps[][]>([]);
  const [index, setIndex] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Charger le premier batch à l'ouverture, safe avec requestAnimationFrame
  useEffect(() => {
    if (isOpen && stats.length > 0 && visibleStats.length === 0) {
      const id = requestAnimationFrame(() => {
        const firstBatch = stats.slice(0, batchSize);
        setVisibleStats([firstBatch]);
        setIndex(batchSize);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen, stats, visibleStats.length, batchSize]);

  // 🔹 Intersection Observer pour chargement infini
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && index < stats.length) {
        const nextBatch = stats.slice(index, index + batchSize);
        setVisibleStats((prev) => [...prev, nextBatch]);
        setIndex((prev) => prev + batchSize);
      }
    },
    [index, stats, batchSize],
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: `${preloadOffset}px 0px 0px 0px`,
      threshold: 0.1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleObserver, preloadOffset]);

  return (
    <div className="fixed bottom-0 left-0 w-full z-40">
      {/* Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
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

      {/* Contenu animé */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] p-4 max-h-[60vh] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto space-y-4">
              {visibleStats.map((batch, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Cards cards={batch} />
                </motion.div>
              ))}
              {/* Dummy div pour observer le scroll et précharger le batch suivant */}
              <div ref={loadMoreRef} className="h-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
