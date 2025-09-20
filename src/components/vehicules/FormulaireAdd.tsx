"use client";

import React from "react";
import reparationsOptions from "@/data/reparationsOptions";
import { Item } from "@/types/entretien";
import {maintenanceParams} from "@/data/maintenanceParams";
import formatDateForInput from "@/utils/formatDateForInput";

interface FormulaireItemProps {
    form: Item;
    setForm: (form: Item) => void;
    handleAddItem: () => void;
    setShowForm: (show: boolean) => void;
    options: {
        intervenant?: string[];
        kmPlaceholder?: string;
        activeTab: "Mécanique" | "Carrosserie" | "Révision" | "Dépenses";
    };
}

const FormulaireItem = ({ form, setForm, handleAddItem, setShowForm, options }: FormulaireItemProps) => {
    const renderReparations = () => {
        if (options.activeTab === "Mécanique") {
            return Object.entries(reparationsOptions["Mécanique"]).map(([sousCat, reparations]) => (
                <optgroup key={sousCat} label={sousCat}>
                    {reparations.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </optgroup>
            ));
        }

        if (options.activeTab === "Révision") {
            return reparationsOptions["Révision générale"].map(r => (
                <option key={r} value={r}>{r}</option>
            ));
        }

        if (options.activeTab === "Carrosserie") {
            return Object.entries(reparationsOptions["Carrosserie"]).map(([sousCat, reparations]) => (
                <optgroup key={sousCat} label={sousCat}>
                    {reparations.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </optgroup>
            ));
        }

        return null;
    };

    return (
        <div className="space-y-3 bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
            {options.activeTab !== "Dépenses" && (
                <select
                    value={form.reparation}
                    onChange={e => {
                        const reparation = e.target.value;
                        const param = maintenanceParams.find(p => p.type === reparation);
                        setForm({
                            ...form,
                            reparation,
                            itemId: param?.id, // 🔹 récupère l'itemId correspondant
                        });
                    }}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Sélectionner une réparation --</option>
                    {renderReparations()}
                </select>
            )}

            {options.intervenant && (
                <select
                    value={form.intervenant}
                    onChange={e => setForm({ ...form, intervenant: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Sélectionner un intervenant --</option>
                    {options.intervenant.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            )}


            <input
                type="date"
                value={formatDateForInput(form.date)}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="number"
                value={form.km}
                onChange={e => setForm({ ...form, km: Number(e.target.value) })}
                placeholder={options.kmPlaceholder || "Kilométrage"}
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="number"
                value={form.montant}
                onChange={e => setForm({ ...form, montant: Number(e.target.value) })}
                placeholder="Prix (€)"
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <textarea
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="Note (optionnelle)"
                className="w-full rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2">
                <button
                    onClick={e => { e.preventDefault(); handleAddItem(); }}
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