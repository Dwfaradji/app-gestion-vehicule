"use client";

import { Trajet, useTrajets } from "@/context/trajetsContext";
import { Dispatch, SetStateAction, useState } from "react";
import { Edit2, Save, Trash, X } from "lucide-react";

interface TrajetsTableProps {
    trajets: Trajet[];
    editingTrajets: number[];
    setEditingTrajets: Dispatch<SetStateAction<number[]>>;
}

export default function TrajetsTable({
                                         trajets,
                                         editingTrajets,
                                         setEditingTrajets,
                                     }: TrajetsTableProps) {
    const { conducteurs, deleteTrajet, addTrajet } = useTrajets();

    // State pour stocker les modifications locales
    const [editingData, setEditingData] = useState<Record<number, Partial<Trajet> & { newAnomalie?: string }>>({});

    const handleChange = (trajetId: number, field: keyof Trajet | "newAnomalie", value: any) => {
        setEditingData(prev => ({
            ...prev,
            [trajetId]: {
                ...prev[trajetId],
                [field]: value,
            },
        }));
    };

    const handleModifierTrajet = (trajetId: number) => {
        setEditingTrajets(prev => [...prev, trajetId]);
        const t = trajets.find(t => t.id === trajetId);
        if (t) {
            setEditingData(prev => ({
                ...prev,
                [trajetId]: { ...t },
            }));
        }
    };

    const handleSave = async (trajetId: number) => {
        const data = editingData[trajetId];
        if (!data?.conducteurId) {
            alert("Veuillez sélectionner un conducteur avant d'enregistrer.");
            return;
        }

        // Ajouter newAnomalie à anomalies si présent
        const anomalies = data.anomalies ?? [];
        if (data.newAnomalie?.trim()) {
            anomalies.push(data.newAnomalie.trim());
        }

        try {
            await addTrajet({ ...data, anomalies, newAnomalie: undefined } as Trajet);
            setEditingTrajets(prev => prev.filter(id => id !== trajetId));
            setEditingData(prev => {
                const copy = { ...prev };
                delete copy[trajetId];
                return copy;
            });
            alert("Trajet enregistré !");
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    };

    const handleSupprimerTrajet = async (trajetId: number) => {
        await deleteTrajet(trajetId);
    };

    const handleRemoveAnomalie = (trajetId: number, index: number) => {
        const t = editingData[trajetId];
        if (!t || !Array.isArray(t.anomalies)) return;
        const updated = [...t.anomalies];
        updated.splice(index, 1);
        handleChange(trajetId, "anomalies", updated);
    };

    const getValue = (trajetId: number, field: keyof Trajet) => {
        return editingData[trajetId]?.[field] ?? trajets.find(t => t.id === trajetId)?.[field] ?? "";
    };

    return (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md mb-6">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {["Conducteur", "Destination", "Km départ", "Km arrivée", "Heure départ", "Heure arrivée", "Carburant", "Anomalies", "Date", "Actions"].map(t => (
                        <th key={t} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{t}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {trajets.map(t => {
                    const isEditing = editingTrajets.includes(t.id);
                    const data = editingData[t.id];
                    return (
                        <tr key={t.id} className="transition hover:bg-blue-50">
                            {/* Conducteur */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <select
                                    value={getValue(t.id, "conducteurId") || ""}
                                    disabled={!isEditing}
                                    onChange={e => handleChange(t.id, "conducteurId", Number(e.target.value))}
                                    className="border rounded px-2 py-1 w-full"
                                >
                                    <option value="">Sélectionner</option>
                                    {conducteurs.map(c => (
                                        <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                                    ))}
                                </select>
                            </td>

                            {/* Destination */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <input
                                    value={getValue(t.id, "destination")}
                                    disabled={!isEditing}
                                    onChange={e => handleChange(t.id, "destination", e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>

                            {/* Km départ */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <input
                                    type="number"
                                    value={getValue(t.id, "kmDepart")}
                                    disabled={!isEditing}
                                    onChange={e => handleChange(t.id, "kmDepart", Number(e.target.value))}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>

                            {/* Km arrivée */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <input
                                    type="number"
                                    value={getValue(t.id, "kmArrivee")}
                                    disabled={!isEditing}
                                    onChange={e => handleChange(t.id, "kmArrivee", Number(e.target.value))}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>

                            {/* Heure départ */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <input
                                    type="time"
                                    value={getValue(t.id, "heureDepart")}
                                    disabled={!isEditing}
                                    onChange={e => handleChange(t.id, "heureDepart", e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>

                            {/* Heure arrivée */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <input
                                    type="time"
                                    value={getValue(t.id, "heureArrivee")}
                                    disabled={!isEditing}
                                    onChange={e => handleChange(t.id, "heureArrivee", e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>

                            {/* Carburant */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <input
                                    type="number"
                                    value={getValue(t.id, "carburant")}
                                    disabled={!isEditing}
                                    onChange={e => handleChange(t.id, "carburant", Number(e.target.value))}
                                    className="w-full border rounded px-2 py-1"
                                />
                            </td>

                            {/* Anomalies */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                <div className="flex flex-col gap-1">
                                    {Array.isArray(data?.anomalies) && data.anomalies.length > 0 && (
                                        <ul className="list-disc list-inside">
                                            {data.anomalies.map((a, i) => (
                                                <li key={i} className="flex justify-between items-center">
                                                    {a}
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => handleRemoveAnomalie(t.id, i)}
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {isEditing && (
                                        <input
                                            type="text"
                                            value={data?.newAnomalie || ""}
                                            placeholder="Ajouter une anomalie et Entrée"
                                            onChange={e => handleChange(t.id, "newAnomalie", e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                                    const updatedAnomalies = Array.isArray(data?.anomalies)
                                                        ? [...data.anomalies, e.currentTarget.value.trim()]
                                                        : [e.currentTarget.value.trim()];
                                                    handleChange(t.id, "anomalies", updatedAnomalies);
                                                    handleChange(t.id, "newAnomalie", "");
                                                }
                                            }}
                                            className="w-full border rounded px-2 py-1"
                                        />
                                    )}
                                </div>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-2 text-sm text-gray-700">
                                {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-2 text-sm text-gray-700 flex gap-2">
                                {isEditing ? (
                                    <button
                                        onClick={() => handleSave(t.id)}
                                        className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                    >
                                        <Save size={16} /> Enregistrer
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleModifierTrajet(t.id)}
                                        className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    >
                                        <Edit2 size={16} /> Modifier
                                    </button>
                                )}
                                <button
                                    onClick={() => handleSupprimerTrajet(t.id)}
                                    className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                >
                                    <Trash size={16} /> Supprimer
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}