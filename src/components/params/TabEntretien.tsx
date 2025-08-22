"use client";
import { Plus } from "lucide-react";
import {ConfirmAction} from "@/types/actions";

interface Entretien {
    type: string;
    seuilKm: number;
}

interface Props {
    parametresEntretien: Entretien[];
    formEntretien: Entretien;
    setFormEntretien: React.Dispatch<React.SetStateAction<Entretien>>;
    showForm: boolean;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabEntretien({ parametresEntretien, formEntretien, setFormEntretien, showForm, setShowForm, setConfirmAction }: Props) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Seuils d'entretien</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 mb-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
                <Plus className="w-4 h-4" /> Ajouter un seuil
            </button>

            {showForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
                    <input type="text" placeholder="Type" value={formEntretien.type}
                           onChange={e => setFormEntretien({ ...formEntretien, type: e.target.value })}
                           className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    <input type="number" placeholder="Seuil Km" value={formEntretien.seuilKm}
                           onChange={e => setFormEntretien({ ...formEntretien, seuilKm: Number(e.target.value) })}
                           className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    <button
                        onClick={() => setConfirmAction({ type: "valider-entretien", target: formEntretien })}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >Valider</button>
                </div>
            )}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seuil Km</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {parametresEntretien.map((p, idx) => (
                    <tr key={idx}>
                        <td className="px-4 py-2 text-sm text-gray-700">{p.type}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{p.seuilKm}</td>
                        <td className="px-4 py-2 text-sm">
                            <button onClick={() => setConfirmAction({ type: "supprimer-entretien", target: p })}
                                    className="text-red-600 hover:underline">Supprimer</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}