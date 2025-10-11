"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Vehicule } from "@/types/vehicule";
import type { Conducteur } from "@/types/trajet";
import { AnimatePresence, motion } from "framer-motion";

interface SearchBarAdvancedProps {
  vehicules: Vehicule[];
  conducteurs: Conducteur[];
  search: string;
  setSearch: (value: string) => void;
  selectedVehicule: string;
  setSelectedVehicule: (value: string) => void;
  selectedConducteur: string;
  setSelectedConducteur: (value: string) => void;
  dateStart: string;
  setDateStart: (value: string) => void;
  dateEnd: string;
  setDateEnd: (value: string) => void;
  heureStart: string;
  setHeureStart: (value: string) => void;
  heureEnd: string;
  setHeureEnd: (value: string) => void;
  disponibleOnly: boolean;
  setDisponibleOnly: (value: boolean) => void;
  infosManquantesOnly: boolean;
  setInfosManquantesOnly: (value: boolean) => void;
  resetFilters: () => void;
}

// const typeIcon = {
//   Utilitaire: Truck,
//   Berline: Car,
//   SUV: TruckIcon,
// };

export const SearchBarAdvanced = ({
  vehicules,
  conducteurs,
  search,
  setSearch,
  selectedVehicule,
  setSelectedVehicule,
  selectedConducteur,
  setSelectedConducteur,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  heureStart,
  setHeureStart,
  heureEnd,
  setHeureEnd,
  infosManquantesOnly,
  setInfosManquantesOnly,
  resetFilters,
}: SearchBarAdvancedProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const vehiculeOptions = useMemo(() => vehicules, [vehicules]);
  const conducteurOptions = useMemo(() => conducteurs, [conducteurs]);
  return (
    <div ref={containerRef} className="relative w-full max-w-full p-4 space-y-2">
      {/* Barre principale */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-70 transition"
        />

        {/* Filtre disponible */}
        {/*<button*/}
        {/*    onClick={() => setDisponibleOnly(!disponibleOnly)}*/}
        {/*    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${*/}
        {/*        disponibleOnly*/}
        {/*            ? "bg-blue-600 text-white shadow-md"*/}
        {/*            : "bg-white text-gray-700 hover:bg-gray-100"*/}
        {/*    }`}*/}
        {/*>*/}
        {/*    Disponible uniquement*/}
        {/*</button>*/}

        {/* Filtre infos manquantes */}
        <button
          onClick={() => setInfosManquantesOnly(!infosManquantesOnly)}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
            infosManquantesOnly
              ? "bg-yellow-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Infos manquantes
        </button>

        {/* Bouton recherche avancée */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full border px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition"
        >
          Recherche avancée
        </button>

        {/* Bouton reset */}
        <button
          onClick={resetFilters}
          className="rounded-full border px-3 py-1 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
        >
          Réinitialiser
        </button>
      </div>

      {/* Filtres avancés inline */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 w-full mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50 flex flex-wrap items-end gap-3"
          >
            {/* Véhicule */}
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-500">Véhicule</label>
              <select
                value={selectedVehicule}
                onChange={(e) => setSelectedVehicule(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm text-sm"
              >
                <option value="">Tous</option>
                {vehiculeOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.modele} ({v.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Conducteur */}
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-medium text-gray-500">Conducteur</label>
              <select
                value={selectedConducteur}
                onChange={(e) => setSelectedConducteur(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm text-sm"
              >
                <option value="">Tous</option>
                {conducteurOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.prenom} {c.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-medium text-gray-500">Date début</label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm text-sm"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-medium text-gray-500">Date fin</label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm text-sm"
              />
            </div>

            {/* Heures */}
            <div className="flex-1 min-w-[100px]">
              <label className="text-xs font-medium text-gray-500">Heure départ</label>
              <input
                type="time"
                value={heureStart}
                onChange={(e) => setHeureStart(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm text-sm"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="text-xs font-medium text-gray-500">Heure fin</label>
              <input
                type="time"
                value={heureEnd}
                onChange={(e) => setHeureEnd(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm text-sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
