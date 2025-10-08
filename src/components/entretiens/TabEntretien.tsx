"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";
import { ConfirmAction } from "@/types/actions";
import { ParametreEntretien } from "@/types/entretien";
import Table from "@/components/ui/Table";
import ActionButtons from "@/components/ui/ActionButtons";
import FormField from "@/components/ui/FormField";

interface Props {
    parametresEntretien: ParametreEntretien[];
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabEntretien({ parametresEntretien, setConfirmAction }: Props) {
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<ParametreEntretien>>({});
    const [formEntretien, setFormEntretien] = useState<Partial<ParametreEntretien>>({});
    const [showFormEntretien, setShowFormEntretien] = useState(false);

    const startEditing = (row: ParametreEntretien) => {
        setEditingRow(row.id!);
        setEditValues({ seuilKm: row.seuilKm, alertKmBefore: row.alertKmBefore });
    };

    const cancelEditing = () => { setEditingRow(null); setEditValues({}); };

    const saveEditing = (row: ParametreEntretien) => {
        const updated: ParametreEntretien = {
            ...row,
            subCategory: row.subCategory ?? "",
            alertKmBefore: editValues.alertKmBefore ?? row.alertKmBefore ?? 0,
            seuilKm: editValues.seuilKm ?? row.seuilKm,
        };
        setConfirmAction({ type: "modifier-entretien", target: updated });
        setEditingRow(null);
    };

    const addNewParam = () => {
        if (!formEntretien.type || !formEntretien.category || !formEntretien.seuilKm || formEntretien.itemId === undefined) return;
        const newParam: Omit<ParametreEntretien, "id"> = {
            itemId: formEntretien.itemId,
            type: formEntretien.type,
            category: formEntretien.category,
            subCategory: formEntretien.subCategory ?? "",
            seuilKm: formEntretien.seuilKm,
            alertKmBefore: formEntretien.alertKmBefore ?? 0,
        };
        setConfirmAction({ type: "valider-entretien", target: newParam });
        setFormEntretien({});
        setShowFormEntretien(false);
    };

    const categories = ["Mécanique", "Révision générale"] as const;
    const sortedParams = [...parametresEntretien].sort(
        (a, b) => categories.indexOf(a.category) - categories.indexOf(b.category)
    );

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Paramètres d'entretien</h2>

            <div className="flex gap-2 mb-3">
                <button
                    onClick={() => setShowFormEntretien(!showFormEntretien)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                    <Plus className="w-4 h-4" /> Ajouter un paramètre
                </button>

                <button
                    onClick={async () => {
                        if (!confirm("Voulez-vous vraiment réinitialiser tous les paramètres d'entretien ?")) return;
                        try {
                            const res = await fetch("/api/parametres-entretien/reset", { method: "POST" });
                            if (!res.ok) throw new Error("Erreur lors de la réinitialisation");
                            alert("Paramètres réinitialisés avec succès !");
                        } catch (err: unknown) {
                            if (err instanceof Error) alert(err.message);
                        }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Réinitialiser les paramètres
                </button>
            </div>

            {showFormEntretien && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
                    <FormField
                        label="Type d’entretien: Vidange, Freins..."
                        type="text"
                        value={formEntretien.type ?? ""}
                        onChange={(val) => setFormEntretien({ ...formEntretien, type: val })}
                        // placeholder="Ex : Vidange, Freins..."
                    />

                    <FormField
                        label="Catégorie: Mécaninique, Revision"
                        type="select"
                        value={formEntretien.category ?? ""}
                        onChange={(val) => setFormEntretien({ ...formEntretien, category: val })}
                        options={["Mécanique", "Révision générale"]}
                    />

                    <FormField
                        label="Seuil Km"
                        type="number"
                        value={formEntretien.seuilKm ?? ""}
                        onChange={(val) => setFormEntretien({ ...formEntretien, seuilKm: val })}
                    />

                    <FormField
                        label="Alerte Km avant"
                        type="number"
                        value={formEntretien.alertKmBefore ?? ""}
                        onChange={(val) => setFormEntretien({ ...formEntretien, alertKmBefore: val })}
                    />

                    <button
                        onClick={addNewParam}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full font-semibold transition"
                    >
                        Valider
                    </button>
                </div>
            )}

            <Table
                data={sortedParams}
                columns={[
                    { key: "type", label: "Type" },
                    { key: "category", label: "Catégorie" },
                    { key: "seuilKm", label: "Seuil Km", render: p =>
                            editingRow === p.id ? (
                                <input
                                    type="number"
                                    value={editValues.seuilKm ?? p.seuilKm}
                                    onChange={e => setEditValues({ ...editValues, seuilKm: Number(e.target.value) })}
                                    className="w-20 rounded border px-2 py-1"
                                />
                            ) : p.seuilKm
                    },
                    { key: "alertKmBefore", label: "Alerte avant (Km)", render: p =>
                            editingRow === p.id ? (
                                <input
                                    type="number"
                                    value={editValues.alertKmBefore ?? p.alertKmBefore ?? ""}
                                    onChange={e => setEditValues({ ...editValues, alertKmBefore: Number(e.target.value) })}
                                    className="w-20 rounded border px-2 py-1"
                                />
                            ) : p.alertKmBefore ?? "-"
                    },
                    {
                        key: "actions",
                        label: "Actions",
                        render: p => (
                            <ActionButtons
                                row={p}
                                buttons={[
                                    editingRow === p.id && {
                                        icon: "Save",
                                        color: "green",
                                        onClick: saveEditing,
                                        tooltip: "Enregistrer",
                                    },
                                    editingRow === p.id && {
                                        icon: "X",
                                        color: "gray",
                                        onClick: cancelEditing,
                                        tooltip: "Annuler",
                                    },
                                    editingRow !== p.id && {
                                        icon: "Pencil",
                                        color: "blue",
                                        onClick: startEditing,
                                        tooltip: "Modifier",
                                    },
                                    editingRow !== p.id && {
                                        icon: "Trash2",
                                        color: "red",
                                        onClick: (row) => setConfirmAction({ type: "supprimer-entretien", target: row }),
                                        tooltip: "Supprimer",
                                    },
                                ].filter(Boolean)}
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
}

