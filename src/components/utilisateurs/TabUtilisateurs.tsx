"use client";

import { Trash2, Check, X } from "lucide-react";
import { useUtilisateurs } from "@/context/utilisateursContext";
import { Utilisateur } from "@/types/utilisateur";
import { formatDate } from "@/utils/formatDate";
import {ConfirmAction} from "@/types/actions";
import * as React from "react";

interface Props {
    utilisateurs: Utilisateur[];
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}


export default function TabUtilisateurs({ utilisateurs, setConfirmAction }: Props) {
    const { updateUtilisateur } = useUtilisateurs();

    const renderStatus = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Validé</span>;
            case "REJECTED":
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Rejeté</span>;
            case "PENDING":
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">En attente</span>;
            default:
                return status;
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">👥 Gestion des utilisateurs</h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        {["Nom", "Fonction", "Date d'inscription", "Statut", "Actions"].map((t) => (
                            <th
                                key={t}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                            >
                                {t}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {utilisateurs.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{u.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{u.fonction}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {formatDate(new Date(u.createdAt))}
                            </td>
                            <td className="px-6 py-4">{renderStatus(u.status)}</td>
                            <td className="px-6 py-4 flex gap-3">
                                {u.status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={() =>
                                                updateUtilisateur({ ...u, status: "APPROVED" })
                                            }
                                            className="p-2 rounded-full bg-green-50 hover:bg-green-100 transition"
                                        >
                                            <Check className="w-5 h-5 text-green-600" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                updateUtilisateur({ ...u, status: "REJECTED" })
                                            }
                                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
                                        >
                                            <X className="w-5 h-5 text-red-600" />
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() =>
                                        setConfirmAction({ type: "supprimer-utilisateur", target: u })
                                    }
                                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
                                >
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}