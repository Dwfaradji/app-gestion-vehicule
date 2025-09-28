import React from "react";
import { FlagIcon } from "lucide-react";

interface ArriveeSectionProps {
    kmDepart: number;
    kmArrivee: number;
    heureArrivee: string;
    destinationArrivee: string;
    carburantArrivee: number;
    anomaliesArrivee: string[];
    newAnomalie: string;
    pleinArrivee: boolean;
    setKmArrivee: (val: number) => void;
    setDestinationArrivee: (val: string) => void;
    setCarburantArrivee: (val: number) => void;
    setAnomaliesArrivee: (val: string[] | ((prev: string[]) => string[])) => void;
    setNewAnomalie: (val: string) => void;
    setPleinArrivee: (val: boolean) => void;
    handleSubmit: () => void;
}
const ArriveeSection = ({
                            kmDepart,
                            kmArrivee,
                            heureArrivee,
                            destinationArrivee,
                            carburantArrivee,
                            anomaliesArrivee,
                            newAnomalie,
                            pleinArrivee,
                            setKmArrivee,
                            setDestinationArrivee,
                            setCarburantArrivee,
                            setAnomaliesArrivee,
                            setNewAnomalie,
                            setPleinArrivee,
                            handleSubmit
                        }: ArriveeSectionProps) => {
    return (
        <>
            <input type="number" value={kmDepart} readOnly className="w-full border px-4 py-3 rounded-xl bg-gray-100" />
            <input
                type="number"
                placeholder="Kilométrage arrivée"
                value={kmArrivee}
                onChange={(e) => setKmArrivee(Number(e.target.value))}
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input type="time" value={heureArrivee} readOnly className="w-full border px-4 py-3 rounded-xl bg-gray-100" />
            <input
                type="text"
                placeholder="Lieu d’arrivée"
                value={destinationArrivee}
                onChange={(e) => setDestinationArrivee(e.target.value)}
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="number"
                placeholder="Carburant (%)"
                value={carburantArrivee}
                onChange={(e) => setCarburantArrivee(Number(e.target.value))}
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-2 my-2">
                <input
                    type="checkbox"
                    checked={pleinArrivee}
                    onChange={(e) => setPleinArrivee(e.target.checked)}
                    className="w-5 h-5"
                />
                <label className="text-sm">Plein de carburant effectué à l&#39;arrivée ⛽</label>
            </div>

            <div className="space-y-1">
                <label className="font-medium">Anomalies</label>
                {anomaliesArrivee.map((a, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
                        <span>{a}</span>
                        <button
                            type="button"
                            onClick={() => setAnomaliesArrivee((prev: string[]) => prev.filter((_, idx) => idx !== i))}
                            className="text-red-600 font-bold"
                        >
                            X
                        </button>
                    </div>
                ))}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Ajouter anomalie"
                        value={newAnomalie}
                        onChange={(e) => setNewAnomalie(e.target.value)}
                        className="flex-1 border px-2 py-1 rounded"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (!newAnomalie.trim()) return;
                            setAnomaliesArrivee((prev: string[]) => [...prev, newAnomalie.trim()]);
                            setNewAnomalie("");
                        }}  className="bg-green-600 text-white px-3 rounded"
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2"
            >
                <FlagIcon size={20} /> Valider l’arrivée
            </button>
        </>
    );
};

export default ArriveeSection;