"use client";

import React from "react";
import reparationsOptions from "@/data/reparationsOptions";

interface FormulaireItemProps {
    form: any;
    setForm: (form: any) => void;
    handleAddItem: () => void;
    setShowForm: (show: boolean) => void;
    options: {
        prestataires?: string[];
        kmPlaceholder?: string;
        activeTab: "Mécanique" | "Carrosserie" | "Révision" | "Dépenses";
    };
}

const FormulaireItem = ({ form, setForm, handleAddItem, setShowForm, options }: FormulaireItemProps) => {
    return (
        <div className="space-y-3 bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
            {/* Réparations dynamiques */}
            {options.activeTab !== "Dépenses" && (
                <select
                    value={form.reparations}
                    onChange={(e) => setForm({ ...form, reparations: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Sélectionner une réparation --</option>

                    {/* 🔹 Mécanique avec optgroup */}
                    {options.activeTab === "Mécanique" &&
                        Object.entries(reparationsOptions["Mécanique"]).map(([sousCat, reparations]) => (
                            <optgroup key={sousCat} label={sousCat}>
                                {reparations.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </optgroup>
                        ))}

                    {/* 🔹 Révision */}
                    {options.activeTab === "Révision" &&
                        Object.values(reparationsOptions["Révision générale"]).flat().map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}

                    {/* 🔹 Carrosserie */}
                    {options.activeTab === "Carrosserie" &&
                        Object.values(reparationsOptions["Carrosserie"]).flat().map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                </select>
            )}

            {/* Prestataire */}
            {options.prestataires && (
                <select
                    value={form.prestataire}
                    onChange={(e) => setForm({ ...form, prestataire: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Sélectionner un prestataire --</option>
                    {options.prestataires.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
            )}

            {/* Date */}
            <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            {/* KM */}
            <input
                type="number"
                value={form.km}
                onChange={(e) => setForm({ ...form, km: Number(e.target.value) })}
                placeholder={options.kmPlaceholder || "Kilométrage"}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            {/* Montant */}
            <input
                type="number"
                value={form.montant}
                onChange={(e) => setForm({ ...form, montant: Number(e.target.value) })}
                placeholder="Prix (€)"
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            {/* Note */}
            <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Note (optionnelle)"
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            {/* Boutons */}
            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleAddItem();
                    }}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                    Valider
                </button>
                <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
};

export default FormulaireItem;