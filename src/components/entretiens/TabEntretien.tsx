"use client";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { useState } from "react";
import { ConfirmAction } from "@/types/actions";
import { ParametreEntretien } from "@/types/entretien";

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
        setEditingRow(row.id as number);
        setEditValues({
            seuilKm: row.seuilKm,
            alertKmBefore: row.alertKmBefore,
        });
    };

    const cancelEditing = () => {
        setEditingRow(null);
        setEditValues({});
    };

    const saveEditing = (row: ParametreEntretien) => {
        // ✅ On complète tous les champs nécessaires pour ParametreEntretien
        const updated: ParametreEntretien = {
            ...row,
            subCategory: row.subCategory ?? "",
            alertKmBefore: editValues.alertKmBefore ?? row.alertKmBefore ?? 0,
            seuilKm: editValues.seuilKm ?? row.seuilKm,
        };
        setConfirmAction({ type: "modifier-entretien", target: updated });
        setEditingRow(null);
    };

    type NewParam = Omit<ParametreEntretien, "id">;

    const addNewParam = () => {
        if (!formEntretien.type || !formEntretien.category || formEntretien.seuilKm === undefined) return;

        const newParam: NewParam = {
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

    // Tri par catégorie
    const categories = ["Mécanique", "Révision générale"] as const;
    type Categorie = (typeof categories)[number];
    const sortedParams = [...parametresEntretien].sort(
        (a, b) => categories.indexOf(a.category) - categories.indexOf(b.category)
    );

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{`Paramètres d'entretien`}</h2>

            <button
                onClick={() => setShowFormEntretien(!showFormEntretien)}
                className="flex items-center gap-2 mb-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
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
                        if (err instanceof Error)
                        alert(err.message);
                    }
                }}
                className="mb-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
                Réinitialiser les paramètres
            </button>

            {showFormEntretien && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
                    <input
                        type="text"
                        placeholder="Type"
                        value={formEntretien.type ?? ""}
                        onChange={e => setFormEntretien({ ...formEntretien, type: e.target.value })}
                        className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={formEntretien.category ?? ""}
                        onChange={e =>
                            setFormEntretien({
                                ...formEntretien,
                                category: e.target.value as Categorie
                            })
                        }
                        className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Choisir une catégorie --</option>
                        <option value="Mécanique">Mécanique</option>
                        <option value="Carrosserie">Carrosserie</option>
                        <option value="Révision générale">Révision générale</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Seuil Km"
                        value={formEntretien.seuilKm ?? ""}
                        onChange={e => setFormEntretien({ ...formEntretien, seuilKm: Number(e.target.value) })}
                        className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Alerte Km avant"
                        value={formEntretien.alertKmBefore ?? ""}
                        onChange={e => setFormEntretien({ ...formEntretien, alertKmBefore: Number(e.target.value) })}
                        className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={addNewParam}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Valider
                    </button>
                </div>
            )}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seuil Km</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alerte avant (Km)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {sortedParams.map(p => (
                    <tr key={p.id}>
                        <td className="px-4 py-2 text-sm text-gray-700">{p.type}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{p.category}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                            {editingRow === p.id ? (
                                <input
                                    type="number"
                                    value={editValues.seuilKm ?? p.seuilKm}
                                    onChange={e => setEditValues({ ...editValues, seuilKm: Number(e.target.value) })}
                                    className="w-20 rounded border px-2 py-1"
                                />
                            ) : p.seuilKm}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                            {editingRow === p.id ? (
                                <input
                                    type="number"
                                    value={editValues.alertKmBefore ?? p.alertKmBefore ?? ""}
                                    onChange={e => setEditValues({ ...editValues, alertKmBefore: Number(e.target.value) })}
                                    className="w-20 rounded border px-2 py-1"
                                />
                            ) : p.alertKmBefore ?? "-"}
                        </td>
                        <td className="px-4 py-2 text-sm flex gap-2">
                            {editingRow === p.id ? (
                                <>
                                    <button onClick={() => saveEditing(p)} className="p-2 text-green-600 hover:bg-green-100 rounded-full">
                                        <Save className="w-4 h-4" />
                                    </button>
                                    <button onClick={cancelEditing} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => startEditing(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setConfirmAction({ type: "supprimer-entretien", target: p })}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}