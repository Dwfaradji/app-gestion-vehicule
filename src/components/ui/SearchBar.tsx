"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Vehicule } from "@/types/vehicule";
import { Truck, Car, TruckIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchBarProps {
  vehicules?: Vehicule[];
  search: string;
  setSearch: (value: string) => void;
  filterType: string | null;
  setFilterType: (value: string | null) => void;
}

const typeIcon = {
  Utilitaire: Truck,
  Berline: Car,
  SUV: TruckIcon,
};

const SearchBarHorizontal = ({
  vehicules,
  search,
  setSearch,
  filterType,
  setFilterType,
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const types = ["Utilitaire", "Berline", "SUV"];

  const filteredVehicules = useMemo(() => {
    return (vehicules ?? []).filter((v) => {
      const matchesType = filterType ? v.type === filterType : true;
      const matchesSearch =
        v.modele.toLowerCase().includes(search.toLowerCase()) ||
        v.immat.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [vehicules, filterType, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-full m-4">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Rechercher véhicule..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          className="w-2/5 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-70 transition duration-200"
        />

        {/* Bouton Tout */}
        <button
          onClick={() => setFilterType(null)}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
            filterType === null
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Tout
        </button>

        {/* Boutons types */}
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(filterType === t ? null : t)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
              filterType === t
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Dropdown horizontal */}
      <AnimatePresence>
        {isOpen && filteredVehicules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 w-full mt-2 overflow-x-auto flex gap-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50"
          >
            {filteredVehicules.map((v) => {
              const Icon = typeIcon[v.type as keyof typeof typeIcon] || Truck;
              return (
                <motion.div
                  key={v.id}
                  onClick={() => {
                    setSearch(v.modele);
                    setIsOpen(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="min-w-[180px] flex-shrink-0 flex items-center gap-2 p-2 border rounded-lg cursor-pointer bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 transition"
                >
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-sm">{v.modele}</p>
                    <p className="text-gray-500 text-xs">Immat : {v.immat}</p>
                    <p className="text-gray-400 text-xs">{v.km} km</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && filteredVehicules.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-full left-0 w-full mt-2 p-2 border border-gray-300 bg-white text-gray-500 rounded-lg shadow-lg"
        >
          Aucun véhicule trouvé
        </motion.div>
      )}
    </div>
  );
};

export default SearchBarHorizontal;
