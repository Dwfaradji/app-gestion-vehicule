"use client";
import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Depense } from "@/types/depenses";

interface Props {
    depenses: Depense[];
}

interface DepenseGraphMonth {
    mois: string;
    mecanique: number;
    carrosserie: number;
    revision: number;
}

const normalizeCat = (cat?: string) =>
    (cat || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function DepensesGraph({ depenses }: Props) {
    const data: DepenseGraphMonth[] = useMemo(() => {
        const result: Record<string, DepenseGraphMonth> = {};

        depenses.forEach(d => {
            const mois = new Date(d.date).toLocaleString("fr-FR", { month: "short" });

            if (!result[mois]) result[mois] = { mois, mecanique: 0, carrosserie: 0, revision: 0 };

            const cat = normalizeCat(d.categorie);
            if (cat === "mecanique") result[mois].mecanique += d.montant;
            if (cat === "carrosserie") result[mois].carrosserie += d.montant;
            if (cat === "revision") result[mois].revision += d.montant;
        });

        return Object.values(result);
    }, [depenses]);

    return (
        <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mécanique" fill="#3b82f6" name="Mécanique" />
                    <Bar dataKey="carrosserie" fill="#10b981" name="Carrosserie" />
                    <Bar dataKey="révision" fill="#f59e0b" name="Révision" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}