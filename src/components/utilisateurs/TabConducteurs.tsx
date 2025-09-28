"use client";

import { useState } from "react";
import { useTrajets } from "@/context/trajetsContext";
import * as React from "react";
import {ConfirmAction} from "@/types/actions";



interface TabConducteursProps {
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}
export default function TabConducteurs({ setConfirmAction }:  TabConducteursProps) {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [loading, setLoading] = useState(false);
    const {  conducteurs } = useTrajets();

    const handleAddConducteur = async () => {
        if (!nom || !prenom) return alert("Nom et prénom requis");

        setLoading(true);
        try {
            if (setConfirmAction) {
                setConfirmAction({ type: "ajouter-conducteur", target: { nom, prenom } });
            }
            setNom("");
            setPrenom("");
        } catch (error) {
            console.error(error);
            alert("Impossible d’ajouter le conducteur");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const conducteur = conducteurs.find(c => c.id === id);
            if (!conducteur) return alert("Conducteur introuvable");

            if (setConfirmAction) {
                setConfirmAction({
                    type: "supprimer-conducteur",
                    target: { id, nom: conducteur.nom, prenom: conducteur.prenom }
                });
            }
        } catch (error) {
            console.error(error);
            alert("Impossible de supprimer le conducteur");
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-6">Gestion des conducteurs</h3>

            {/* Formulaire ajout */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="border px-4 py-2 rounded-md flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <input
                    type="text"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="border px-4 py-2 rounded-md flex-1 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <button
                    onClick={handleAddConducteur}
                    disabled={loading}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Ajout..." : "Ajouter"}
                </button>
            </div>

            {/* Liste des conducteurs */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-2 text-left">Nom</th>
                        <th className="px-4 py-2 text-left">Prénom</th>
                        <th className="px-4 py-2 text-left">Code</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {conducteurs.map((c, idx) => (
                        <tr
                            key={c.id}
                            className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                        >
                            <td className="px-4 py-2 font-medium">{c.nom}</td>
                            <td className="px-4 py-2">{c.prenom}</td>
                            <td className="px-4 py-2 font-mono">{c.code}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    {conducteurs.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-4 text-gray-500">
                                Aucun conducteur
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}