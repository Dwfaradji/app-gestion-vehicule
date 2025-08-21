"use client";

import { useState, useMemo } from "react";
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
import { useData } from "@/context/DataContext";

export default function DepensesPage() {
    const { vehicules } = useData(); // ⚡ Données mockées centralisées

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<"all" | "mecanique" | "carrosserie" | "revision">("all");

    // Préparer les dépenses cumulées par véhicule
    const depenses = useMemo(() => {
        return vehicules.map((v) => {
            // Somme des montants sur tous les mois
            console.log(v)
            const totalMeca = v.depenses.reduce((sum, i) => sum + (i.mécanique || 0), 0);
            const totalCarrosserie = v.depenses.reduce((sum, i) => sum + (i.carrosserie || 0), 0);
            const totalRevision = v.depenses.reduce((sum, i) => sum + (i.révision || 0), 0);
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

    // Filtrer et trier
    const filteredDepenses = useMemo(() => {
        return depenses
            .filter(
                (v) =>
                    v.immat.toLowerCase().includes(search.toLowerCase()) ||
                    v.modele.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => b.total - a.total);
    }, [depenses, search]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dépenses globales des véhicules</h1>

            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Rechercher par immatriculation ou modèle..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm flex-1"
                />
                {["all", "mecanique", "carrosserie", "revision"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            category === cat ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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

            <div className="rounded-xl bg-white shadow border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Comparaison des coûts par véhicule</h2>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredDepenses} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="immat" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(value) => `${value}€`} />
                            <Tooltip
                                formatter={(value: number, name: string) => [`${value} €`, name]}
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