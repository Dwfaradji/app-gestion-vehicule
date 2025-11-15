"use client";

import React, { useMemo, useState } from "react";
import Collapsible from "@/components/ui/Collapsible";
import Table, { Column } from "@/components/ui/Table";
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
import {formatDateNumeric} from "@/utils/formatDate";

export interface Depense {
    id: number;
    categorie: string;
    type: string;
    reparation?: string;
    description?: string;
    note?: string;
    intervenant?: string;
    km?: number;
    date: string;
    montant: number;
    vehiculeId: number;
}

export interface Vehicle {
    id: number;
    marque: string;
    modele: string;
}

interface DetailDepensesForVehicleProps {
    vehicle: Vehicle;
    depenses: Depense[];
}

export default function DetailDepensesForVehicle({
                                                     vehicle,
                                                     depenses,
                                                 }: DetailDepensesForVehicleProps) {
    const [search, setSearch] = useState("");

    if (!vehicle) {
        return (
            <div className="p-6 text-red-600 font-semibold">
                Aucun véhicule sélectionné.
            </div>
        );
    }

    // 🔹 Catégorisation des dépenses
    const categories = useMemo(() => {
        const cats: Record<string, Depense[]> = {
            mecanique: [],
            carrosserie: [],
            revision: [],
            carburant: [],
            controleTechnique: [],
            autres: [],
        };

        depenses.forEach((d) => {
            const cat = d.categorie?.toLowerCase() ?? "";
            if (cat.includes("mécanique") || cat.includes("mecanique")) cats.mecanique.push(d);
            else if (cat.includes("carrosserie")) cats.carrosserie.push(d);
            else if (cat.includes("révision") || cat.includes("revision")) cats.revision.push(d);
            else if (cat.includes("carburant")) cats.carburant.push(d);
            else if (cat.includes("controle") || cat.includes("ct")) cats.controleTechnique.push(d);
            else cats.autres.push(d);
        });

        return cats;
    }, [depenses]);

    // 🔹 Filtrage avec recherche
    const filteredCategories = useMemo(() => {
        if (!search.trim()) return categories; // pas de filtre si vide
        const term = search.trim().toLowerCase();

        const filterDepenses = (depenses: Depense[]) =>
            depenses.filter((d) =>
                d.categorie.toLowerCase().includes(term) ||
                d.reparation?.toLowerCase().includes(term) ||
                d.intervenant?.toLowerCase().includes(term) ||
                d.date.includes(term) ||
                d.montant.toString().includes(term)
            );

        return {
            mecanique: filterDepenses(categories.mecanique),
            carrosserie: filterDepenses(categories.carrosserie),
            revision: filterDepenses(categories.revision),
            carburant: filterDepenses(categories.carburant),
            controleTechnique: filterDepenses(categories.controleTechnique),
            autres: filterDepenses(categories.autres),
        };
    }, [search, categories]);

    // 🔹 Calcul des totaux pour le graphique
    const chartData = useMemo(() => {
        return [
            { categorie: "Mécanique", montant: filteredCategories.mecanique.reduce((sum, d) => sum + d.montant, 0) },
            { categorie: "Carrosserie", montant: filteredCategories.carrosserie.reduce((sum, d) => sum + d.montant, 0) },
            { categorie: "Révision", montant: filteredCategories.revision.reduce((sum, d) => sum + d.montant, 0) },
            { categorie: "Carburant", montant: filteredCategories.carburant.reduce((sum, d) => sum + d.montant, 0) },
            { categorie: "Contrôle technique", montant: filteredCategories.controleTechnique.reduce((sum, d) => sum + d.montant, 0) },
            { categorie: "Autres", montant: filteredCategories.autres.reduce((sum, d) => sum + d.montant, 0) },
        ];
    }, [filteredCategories]);

    // 🔹 Colonnes communes pour tous les tableaux
    const columns: Column<Depense>[] = [
        { key: "categorie", label: "Catégorie" },
        { key: "reparation", label: "Réparation" },
        { key: "note", label: "Note" },
        { key: "intervenant", label: "Intervenant" },
        { key: "km", label: "KM" },
        {
            key: "date",
            label: "Date",
            render: (d) => formatDateNumeric(d.date)
        },
        { key: "montant", label: "Montant (€)", render: (d) => <span className="font-bold text-green-600">{d.montant} €</span> },
    ];

    const sections: { title: string; key: keyof typeof filteredCategories }[] = [
        { title: "Frais mécaniques", key: "mecanique" },
        { title: "Carrosserie", key: "carrosserie" },
        { title: "Révisions", key: "revision" },
        { title: "Carburant", key: "carburant" },
        { title: "Contrôle technique", key: "controleTechnique" },
        { title: "Autres", key: "autres" },
    ];

    return (
        <div className="p-10 space-y-10">
            <h1 className="text-3xl font-bold mb-6">
                Détails des dépenses pour : {vehicle.marque} {vehicle.modele}
            </h1>

            {/* 🔹 Barre de recherche */}
            <input
                type="text"
                placeholder="Rechercher par catégorie, réparation, date, intervenant ou montant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* 🔹 Graphique global */}
            <div className="rounded-xl bg-white shadow border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Répartition des dépenses</h2>
                <div style={{ height: 300, width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="categorie" />
                            <YAxis tickFormatter={(value) => `${value}€`} />
                            <Tooltip formatter={(value: number) => `${value} €`} />
                            <Legend />
                            <Bar dataKey="montant" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 🔹 Sections avec tableaux */}
            {sections.map((section) => (
                <Collapsible
                    key={section.key}
                    title={`${section.title} (${filteredCategories[section.key].length})`}
                    length={filteredCategories[section.key].length}
                    defaultOpen={filteredCategories[section.key].length > 0}
                >
                    <Table
                        data={filteredCategories[section.key]}
                        columns={columns}
                        emptyMessage="Aucune dépense pour cette catégorie"
                        responsive
                    />
                </Collapsible>
            ))}
        </div>
    );
}