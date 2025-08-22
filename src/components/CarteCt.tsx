"use client";

import { formatDate } from "@/utils/formatDate";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useData } from "@/context/DataContext";
import { useState } from "react";

interface CarteCTProps {
    vehiculeId: number;
    ctValidite: string;
}

const CarteCT = ({ vehiculeId, ctValidite }: CarteCTProps) => {
    const { updateVehicule } = useData();
    const [loading, setLoading] = useState(false);
    const [currentCT, setCurrentCT] = useState(ctValidite);

    const isValid = new Date(currentCT) > new Date();

    const handleValiderCT = async (contreVisite: boolean = false) => {
        setLoading(true);
        try {
            const newDate = new Date();
            newDate.setFullYear(newDate.getFullYear() + 1); // CT valide 1 an par défaut
            if (contreVisite) {
                // Si contre-visite, prolonger seulement de quelques mois (ex: 3 mois)
                newDate.setMonth(newDate.getMonth() + 3);
            }
            await updateVehicule({ id: vehiculeId, ctValidite: newDate.toISOString() });
            setCurrentCT(newDate.toISOString());
        } catch (err) {
            console.error("Erreur mise à jour CT:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-60 rounded-xl bg-white shadow-md border-l-8 border-blue-500 p-4 relative font-sans">
            <div className="absolute top-0 right-0 h-full w-4 bg-gray-100 rounded-tr-xl rounded-br-xl"></div>

            <h2 className="text-lg font-bold mb-2 text-gray-800">Contrôle Technique</h2>

            <p className="text-sm text-gray-600 mb-2">
                Validité : <strong className="text-gray-900">{formatDate(currentCT)}</strong>
            </p>

            <div className="flex items-center gap-2 mt-3">
                {isValid ? (
                    <FaCheckCircle className="text-green-600" />
                ) : (
                    <FaTimesCircle className="text-red-600" />
                )}
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                    {isValid ? "CT valide" : "CT expiré"}
                </span>
            </div>

            {!isValid && (
                <div className="mt-3 flex flex-col gap-2">
                    <button
                        disabled={loading}
                        onClick={() => handleValiderCT(false)}
                        className="w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                        {loading ? "..." : "Valider le CT"}
                    </button>
                    <button
                        disabled={loading}
                        onClick={() => handleValiderCT(true)}
                        className="w-full bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm"
                    >
                        {loading ? "..." : "Valider avec contre-visite"}
                    </button>
                </div>
            )}

            <div className="mt-4 text-[10px] text-gray-400 border-t border-dashed border-gray-300 pt-2">
                Véhicule conforme aux normes françaises
            </div>
        </div>
    );
};

export default CarteCT;