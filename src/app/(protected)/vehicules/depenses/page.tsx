"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useVehicules } from "@/context/vehiculesContext";
import type { Depense } from "@/types/depenses";

type Categorie = "all" | "mecanique" | "carrosserie" | "revision";

interface VehiculeDepenses {
  immat: string;
  modele: string;
  mecanique: number;
  carrosserie: number;
  revision: number;
  total: number;
}

export default function DepensesPage() {
  const { vehicules } = useVehicules();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Categorie>("all");

  // 🔹 Calcul des dépenses par véhicule
  const vehiculeDepenses = useMemo<VehiculeDepenses[]>(() => {
    return vehicules.map((v) => {
      const depenses: Depense[] = v.depense ?? [];

      // Initialisation des totaux
      let totalMeca = 0;
      let totalCarrosserie = 0;
      let totalRevision = 0;

      // 🔹 Une seule boucle sur les dépenses
      for (const d of depenses) {
        const cat = d.categorie.toLowerCase();

        if (cat.includes("méca")) totalMeca += d.montant;
        else if (cat.includes("carros")) totalCarrosserie += d.montant;
        else if (cat.includes("révi")) totalRevision += d.montant;
      }

      const total = totalMeca + totalCarrosserie + totalRevision;

      return {
        immat: v.immat,
        modele: v.modele,
        mecanique: totalMeca,
        carrosserie: totalCarrosserie,
        revision: totalRevision,
        total,
      };
    });
  }, [vehicules]);

  // 🔹 Filtrage et tri
  const filteredDepenses = useMemo(() => {
    return vehiculeDepenses
      .filter(
        (v) =>
          v.immat.toLowerCase().includes(search.toLowerCase()) ||
          v.modele.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => b.total - a.total);
  }, [vehiculeDepenses, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dépenses globales des véhicules</h1>

      {/* 🔹 Recherche + filtres */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher par immatriculation ou modèle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm flex-1"
        />
        {(["all", "mecanique", "carrosserie", "revision"] as Categorie[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              category === cat
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat === "all"
              ? "Toutes"
              : cat === "mecanique"
                ? "Mécanique"
                : cat === "carrosserie"
                  ? "Carrosserie"
                  : "Révision"}
          </button>
        ))}
      </div>

      {/* 🔹 Graphique */}
      <div className="rounded-xl bg-white shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Comparaison des coûts par véhicule
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredDepenses}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="immat" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${value}€`} />
              <Tooltip
                formatter={(value: unknown, name: string) => [`${value as number} €`, name]}
                labelFormatter={(label) => {
                  const veh = filteredDepenses.find((v) => v.immat === label);
                  return `${label} - Total: ${veh?.total} €`;
                }}
              />
              <Legend verticalAlign="top" height={36} />

              {(category === "all" || category === "mecanique") && (
                <Bar dataKey="mecanique" fill="#3b82f6" radius={[5, 5, 0, 0]}>
                  <LabelList dataKey="mecanique" position="top" formatter={(val) => `${val}€`} />
                </Bar>
              )}
              {(category === "all" || category === "carrosserie") && (
                <Bar dataKey="carrosserie" fill="#f97316" radius={[5, 5, 0, 0]}>
                  <LabelList dataKey="carrosserie" position="top" formatter={(val) => `${val}€`} />
                </Bar>
              )}
              {(category === "all" || category === "revision") && (
                <Bar dataKey="revision" fill="#10b981" radius={[5, 5, 0, 0]}>
                  <LabelList dataKey="revision" position="top" formatter={(val) => `${val}€`} />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
