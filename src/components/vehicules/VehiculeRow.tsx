"use client";

import { Vehicule } from "@/types/vehicule";
import { Trash } from "lucide-react";

interface VehiculeRowProps {
    vehicule: Vehicule;
    setConfirmAction: React.Dispatch<React.SetStateAction<any>>;
}

export default function VehiculeRow({ vehicule, setConfirmAction }: VehiculeRowProps) {
    return (
        <tr>
            <td className="px-4 py-2 text-sm text-gray-700">{vehicule.type}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{vehicule.constructeur}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{vehicule.modele}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{vehicule.km?.toLocaleString()} km</td>
            <td className="px-4 py-2 text-sm text-gray-700">{vehicule.immat}</td>
            <td className="px-4 py-2 text-sm flex gap-2">
                <button
                    onClick={() => setConfirmAction({ type: "supprimer-vehicule", target: vehicule })}
                    className="text-red-600 flex items-center gap-1 hover:underline"
                >
                    <Trash className="w-3 h-3" /> Supprimer
                </button>
            </td>
        </tr>
    );
}