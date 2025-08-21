"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useData } from "@/context/DataContext";
import {Utilisateur} from "@/types/utilisateur";


interface Props {
    utilisateurs: Utilisateur[];
    formUtilisateur: { nom: string; fonction: string };
    setFormUtilisateur: React.Dispatch<React.SetStateAction<{ nom: string; fonction: string }>>;
    showForm: boolean;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmAction: (action:
                           | { type: "valider-utilisateur"; target: any }
                           | { type: "supprimer-utilisateur"; target: any }
    ) => void;
}

export default function TabUtilisateurs({ utilisateurs, formUtilisateur, setFormUtilisateur, showForm, setShowForm, setConfirmAction }: Props) {
    const [error, setError] = useState("");
    const { updateUtilisateur } = useData();

    const handleValidate = () => {
        if (!formUtilisateur.nom.trim() || !formUtilisateur.fonction.trim()) {
            setError("Tous les champs sont obligatoires.");
            return;
        }
        setError("");
        setConfirmAction({ type: "valider-utilisateur", target: formUtilisateur });
        setFormUtilisateur({ nom: "", fonction: "" });
        setShowForm(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Gestion des utilisateurs</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 mb-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
                <Plus className="w-4 h-4" /> Ajouter un utilisateur
            </button>

            {showForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <input
                        type="text"
                        placeholder="Nom"
                        value={formUtilisateur.nom}
                        onChange={e => setFormUtilisateur({ ...formUtilisateur, nom: e.target.value })}
                        className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Fonction"
                        value={formUtilisateur.fonction}
                        onChange={e => setFormUtilisateur({ ...formUtilisateur, fonction: e.target.value })}
                        className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleValidate}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Valider
                    </button>
                </div>
            )}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {["Nom", "Fonction", "Date", "Statut", "Actions"].map(t => (
                        <th key={t} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {utilisateurs.map(u => (
                    <tr key={u.id}>
                        <td className="px-4 py-2 text-sm text-gray-700">{u.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{u.fonction}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{u.date}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{u.status}</td>
                        <td className="px-4 py-2 text-sm flex gap-2">
                            {u.status === "PENDING" && (
                                <>
                                    <button
                                        onClick={() => updateUtilisateur({ ...u, status: "APPROVED" })}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        Valider
                                    </button>
                                    <button
                                        onClick={() => updateUtilisateur({ ...u, status: "REJECTED" })}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Rejeter
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => setConfirmAction({ type: "supprimer-utilisateur", target: u })}
                                className="text-red-600 hover:underline"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}