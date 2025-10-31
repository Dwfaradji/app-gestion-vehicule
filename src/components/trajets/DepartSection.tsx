import React from "react";
import { PlayCircle } from "lucide-react";

interface DepartSectionProps {
  kmDepart: number;
  heureDepart: string;
  destinationDepart: string;
  carburantDepart: number;
  anomaliesDepart: string[];
  newAnomalie: string;
  pleinDepart: boolean;
  setKmDepart: (val: number) => void;
  setDestinationDepart: (val: string) => void;
  setCarburantDepart: (val: number) => void;
  setAnomaliesDepart: (val: string[] | ((prev: string[]) => string[])) => void;
  setNewAnomalie: (val: string) => void;
  setPleinDepart: (val: boolean) => void;
  handleSubmit: () => void;
}

const DepartSection = ({
  kmDepart,
  heureDepart,
  destinationDepart,
  carburantDepart,
  anomaliesDepart,
  newAnomalie,
  pleinDepart,
  setDestinationDepart,
  setCarburantDepart,
  setAnomaliesDepart,
  setNewAnomalie,
  setPleinDepart,
  handleSubmit,
}: DepartSectionProps) => {
  return (
    <>
      <input
        type="number"
        value={kmDepart}
        readOnly
        className="w-full border px-4 py-3 rounded-xl bg-gray-100"
      />
      <input
        type="time"
        value={heureDepart}
        readOnly
        className="w-full border px-4 py-3 rounded-xl bg-gray-100"
      />
      <input
        type="text"
        placeholder="Lieu de départ"
        value={destinationDepart}
        onChange={(e) => setDestinationDepart(e.target.value)}
        className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Carburant (%)"
        value={carburantDepart}
        onChange={(e) => setCarburantDepart(Number(e.target.value))}
        className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center gap-2 my-2">
        <input
          type="checkbox"
          checked={pleinDepart}
          onChange={(e) => setPleinDepart(e.target.checked)}
          className="w-5 h-5"
        />
        <label className="text-sm">Plein de carburant effectué au départ ⛽</label>
      </div>

      <div className="space-y-1">
        <label className="font-medium">Anomalies</label>
        {anomaliesDepart.map((a, i) => (
          <div key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
            <span>{a}</span>
            <button
              type="button"
              onClick={() => setAnomaliesDepart((prev) => prev.filter((_, idx) => idx !== i))}
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
              setAnomaliesDepart((prev) => [...prev, newAnomalie.trim()]);
              setNewAnomalie("");
            }}
            className="bg-green-600 text-white px-3 rounded"
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
        <PlayCircle size={20} /> Valider le départ
      </button>
    </>
  );
};

export default DepartSection;
