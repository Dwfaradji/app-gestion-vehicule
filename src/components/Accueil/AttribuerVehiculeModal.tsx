"use client";

import React, { useEffect, useState } from "react";
import { Vehicule } from "@/types/vehicule";
import { Conducteur, Trajet } from "@/types/trajet";
import clsx from "clsx";

interface AttribuerVehiculeModalProps {
    vehicules: Vehicule[];
    conducteurs: Conducteur[];
    trajets: Trajet[];
    setAttribuerOpen: (open: boolean) => void;
    addTrajet: (trajet: Trajet) => Promise<void>;
}

export default function AttribuerVehiculeModal({
                                                   vehicules,
                                                   conducteurs,
                                                   trajets,
                                                   setAttribuerOpen,
                                                   addTrajet,
                                               }: AttribuerVehiculeModalProps) {
    const [step, setStep] = useState(1);
    const [selectedVehicule, setSelectedVehicule] = useState<number | null>(null);
    const [selectedConducteur, setSelectedConducteur] = useState<number | null>(null);
    const [maintenant, setMaintenant] = useState(new Date());
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => setFadeIn(true), []);

    useEffect(() => {
        const interval = setInterval(() => setMaintenant(new Date()), 60_000);
        return () => clearInterval(interval);
    }, []);

    const isVehiculeDisponible = (vehiculeId: number, conducteurId?: number | null) => {
        const trajet = trajets.find((t) => t.vehiculeId === vehiculeId);
        if (!trajet || !trajet.conducteurId) return true;
        if (conducteurId && trajet.conducteurId === conducteurId) return false;
        if (!trajet.heureArrivee) return false;
        const arrivee = new Date(trajet.createdAt);
        const [h, m] = trajet.heureArrivee.split(":").map(Number);
        arrivee.setHours(h, m, 0, 0);
        return arrivee <= maintenant;
    };

    const isConducteurDisponible = (conducteurId: number) =>
        !trajets.some((t) => t.conducteurId === conducteurId && !t.heureArrivee);

    const handleConfirmAttribution = async () => {
        if (!selectedVehicule || !selectedConducteur) return;
        const newTrajet: Trajet = {
            id: Date.now(),
            vehiculeId: selectedVehicule,
            conducteurId: selectedConducteur,
            kmDepart: null,
            kmArrivee: null,
            heureDepart: "",
            heureArrivee: "",
            destination: "",
            anomalies: [],
            carburant: 0,
            createdAt: new Date().toISOString(),
        };
        try {
            await addTrajet(newTrajet);
            setAttribuerOpen(false);
            setStep(1);
            setSelectedVehicule(null);
            setSelectedConducteur(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
            <div
                className={clsx(
                    "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-6 w-full max-w-md shadow-2xl relative transform transition-all duration-500",
                    fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
            >
                {/* Bouton fermer */}
                <button
                    onClick={() => setAttribuerOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
                >
                    &times;
                </button>

                {/* Progress bar */}
                <div className="flex items-center mb-6">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={clsx(
                                "flex-1 h-2 mx-1 rounded-full transition-colors duration-300",
                                step >= s ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
                            )}
                        />
                    ))}
                </div>

                <h2 className="text-2xl font-semibold mb-4">
                    {step === 1 && "Sélectionner un véhicule"}
                    {step === 2 && "Sélectionner un conducteur"}
                    {step === 3 && "Confirmer l’attribution"}
                </h2>

                {/* Step 1 - Véhicule */}
                {step === 1 && (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {vehicules.filter((v) => isVehiculeDisponible(v.id, selectedConducteur)).map((v) => (
                            <div
                                key={v.id}
                                onClick={() => setSelectedVehicule(v.id)}
                                className={clsx(
                                    "p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800",
                                    selectedVehicule === v.id && "bg-blue-50 border-blue-400 dark:bg-blue-900 dark:border-blue-600"
                                )}
                            >
                                <p className="font-medium">{v.modele} ({v.immat})</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{v.km.toLocaleString()} km</p>
                            </div>
                        ))}
                        {vehicules.filter((v) => isVehiculeDisponible(v.id, selectedConducteur)).length === 0 && (
                            <p className="text-red-500 text-sm">Aucun véhicule disponible.</p>
                        )}
                        <button
                            disabled={!selectedVehicule}
                            onClick={() => setStep(2)}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50 transition"
                        >
                            Continuer
                        </button>
                    </div>
                )}

                {/* Step 2 - Conducteur */}
                {step === 2 && (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {conducteurs.filter((c) => isConducteurDisponible(c.id)).map((c) => (
                            <div
                                key={c.id}
                                onClick={() => setSelectedConducteur(c.id)}
                                className={clsx(
                                    "p-3 border rounded-lg cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800",
                                    selectedConducteur === c.id && "bg-blue-50 border-blue-400 dark:bg-blue-900 dark:border-blue-600"
                                )}
                            >
                                <p className="font-medium">{c.prenom} {c.nom}</p>
                            </div>
                        ))}
                        {conducteurs.filter((c) => isConducteurDisponible(c.id)).length === 0 && (
                            <p className="text-red-500 text-sm">Aucun conducteur disponible.</p>
                        )}
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                Retour
                            </button>
                            <button
                                disabled={!selectedConducteur}
                                onClick={() => setStep(3)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
                            >
                                Continuer
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3 - Confirmation */}
                {step === 3 && (
                    <div className="space-y-4">
                        <p>Tu es sur le point d’attribuer :</p>
                        <ul className="list-disc list-inside text-sm">
                            <li>
                                Véhicule : {vehicules.find((v) => v.id === selectedVehicule)?.modele} (
                                {vehicules.find((v) => v.id === selectedVehicule)?.immat})
                            </li>
                            <li>
                                Conducteur : {conducteurs.find((c) => c.id === selectedConducteur)?.prenom}{" "}
                                {conducteurs.find((c) => c.id === selectedConducteur)?.nom}
                            </li>
                        </ul>
                        <div className="flex justify-between">
                            <button onClick={() => setStep(2)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                Retour
                            </button>
                            <button
                                onClick={handleConfirmAttribution}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}