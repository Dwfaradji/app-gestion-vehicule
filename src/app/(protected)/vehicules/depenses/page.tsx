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
} from "recharts";
import Table from "@/components/ui/Table";
import Collapsible from "@/components/ui/Collapsible";
import { useVehicules } from "@/context/vehiculesContext";
import { useDepenses } from "@/context/depensesContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Categorie = "all" | "mecanique" | "carrosserie" | "revision";

type CategorieBtn = {
  id: number;
  key: Categorie;
  label: string;
  color: string;
  icon?: React.ComponentType<{ className?: string }>;
};

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
  const { depenses } = useDepenses();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Categorie>("all");
  const vehiculeDepenses = useMemo<VehiculeDepenses[]>(() => {
    return vehicules.map((v) => {
      const depensesVehicule = depenses.filter((d) => d.vehiculeId === v.id);

      let totalMeca = 0;
      let totalCarrosserie = 0;
      let totalRevision = 0;

      for (const d of depensesVehicule) {
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
  }, [vehicules, depenses]); // <— observe aussi `depenses`

  // 🔹 Filtrage des véhicules avec au moins une dépense et par recherche
  const filteredDepenses = useMemo(() => {
    return vehiculeDepenses
      .filter(
        (v) =>
          (v.mecanique > 0 || v.carrosserie > 0 || v.revision > 0) &&
          (v.immat.toLowerCase().includes(search.toLowerCase()) ||
            v.modele.toLowerCase().includes(search.toLowerCase())),
      )
      .sort((a, b) => b.total - a.total);
  }, [vehiculeDepenses, search]);

  // 🔹 Totaux globaux
  const totalGlobal = useMemo(() => {
    return filteredDepenses.reduce(
      (acc, v) => ({
        mecanique: acc.mecanique + v.mecanique,
        carrosserie: acc.carrosserie + v.carrosserie,
        revision: acc.revision + v.revision,
        total: acc.total + v.total,
      }),
      { mecanique: 0, carrosserie: 0, revision: 0, total: 0 },
    );
  }, [filteredDepenses]);

  const chartData = filteredDepenses.map((v) => ({
    immat: v.immat,
    mecanique: v.mecanique > 0 ? v.mecanique : undefined,
    carrosserie: v.carrosserie > 0 ? v.carrosserie : undefined,
    revision: v.revision > 0 ? v.revision : undefined,
    total: v.total,
  }));

  const categorieBtns: CategorieBtn[] = [
    { id: 1, key: "all", color: "bg-red-400", label: "Toutes" },
    { id: 2, key: "mecanique", color: "bg-blue-400", label: "Mécanique" },
    { id: 3, key: "carrosserie", color: "bg-orange-400", label: "Carrosserie" },
    { id: 4, key: "revision", color: "bg-green-400", label: "Révision" },
  ];

  return (
    <div className="min-h-screen grid gap-10 p-1">
      <div className="flex items-center justify-between px-8 py-6  border-b border-gray-300 dark:border-gray-700 ">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold flex items-center gap-2"
        >
          Dépenses Globales Des Véhicules
        </motion.h1>
      </div>
      {/* 🔹 Recherche et filtres */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher par immatriculation ou modèle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm flex-1"
        />
        {categorieBtns.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === cat.key
                ? `${cat.color} text-white`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* 🔹 Graphique des dépenses */}
      <div className="rounded-xl bg-white shadow border border-gray-200 p-6">
        <Collapsible title={"Comparaison des coûts par véhicule"}>
          <div>
            <div style={{ minWidth: filteredDepenses.length * 120, height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  barCategoryGap="35%"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="immat"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
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
                    <Bar dataKey="mecanique" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={50} />
                  )}
                  {(category === "all" || category === "carrosserie") && (
                    <Bar
                      dataKey="carrosserie"
                      fill="#f97316"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={50}
                    />
                  )}
                  {(category === "all" || category === "revision") && (
                    <Bar dataKey="revision" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={50} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Collapsible>
      </div>

      {/* 🔹 Table des dépenses par véhicule avec totaux */}
      <div className="rounded-xl bg-white shadow border border-gray-200 p-6">
        <Collapsible title={`Dépenses par véhicule (${filteredDepenses.length})`}>
          <div className="overflow-x-auto">
            <Table
              data={filteredDepenses}
              columns={[
                { key: "immat", label: "Immatriculation" },
                { key: "modele", label: "Modèle" },
                { key: "mecanique", label: "Mécanique (€)" },
                { key: "carrosserie", label: "Carrosserie (€)" },
                { key: "revision", label: "Révision (€)" },
                { key: "total", label: "Total (€)" },
              ]}
              footer={{
                immat: "Total global",
                modele: "",
                mecanique: totalGlobal.mecanique,
                carrosserie: totalGlobal.carrosserie,
                revision: totalGlobal.revision,
                total: totalGlobal.total,
              }}
            />
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
