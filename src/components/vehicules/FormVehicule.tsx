"use client";

import { useState } from "react";
import type { Vehicule } from "@/types/vehicule";

interface FormVehiculeProps {
  initialData?: Partial<Vehicule>;
  onSubmit: (v: Vehicule) => void;
  onCancel?: () => void;
}

export default function FormVehicule({ initialData = {}, onSubmit, onCancel }: FormVehiculeProps) {
  const [form, setForm] = useState<Partial<Vehicule>>({
    type: "",
    modele: "",
    km: 0,
    annee: new Date().getFullYear(),
    energie: "",
    prixAchat: 0,
    dateEntretien: "",
    statut: "Disponible",
    prochaineRevision: "",
    immat: "",
    ctValidite: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.type) newErrors.type = "Type requis";
    if (!form.modele) newErrors.modele = "Modèle requis";
    if (!form.immat) newErrors.immat = "Immatriculation requise";
    if (!form.km && form.km !== 0) newErrors.km = "Kilométrage requis";
    if (!form.energie) newErrors.energie = "Énergie requise";
    if (!form.prixAchat && form.prixAchat !== 0) newErrors.prixAchat = "Prix d'achat requis";
    if (!form.dateEntretien) newErrors.dateEntretien = "Date d'entretien requise";
    if (!form.prochaineRevision) newErrors.prochaineRevision = "Date prochaine révision requise";
    if (!form.ctValidite) newErrors.ctValidite = "CT requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form as Vehicule);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
      {[
        { label: "Type", key: "type", type: "text" },
        { label: "Modèle", key: "modele", type: "text" },
        { label: "Kilométrage", key: "km", type: "number" },
        { label: "Année", key: "annee", type: "number" },
        { label: "Énergie", key: "energie", type: "text" },
        { label: "Prix d'achat", key: "prixAchat", type: "number" },
        { label: "Date d'entretien", key: "dateEntretien", type: "date" },
        { label: "Statut", key: "statut", type: "text" },
        { label: "Date prochaine révision", key: "prochaineRevision", type: "date" },
        { label: "Immatriculation", key: "immat", type: "text" },
        { label: "CT", key: "ctValidite", type: "date" },
      ].map(({ label, key, type }) => (
        <div key={key} className="flex flex-col">
          <label className="text-sm font-medium mb-1">{label}</label>
          <input
            type={type}
            // TODO -> voir si sa fonctionne
            value={form[key as keyof Vehicule] as string | number}
            onChange={(e) =>
              setForm({
                ...form,
                [key]: type === "number" ? Number(e.target.value) : e.target.value,
              })
            }
            className={`rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500 ${
              errors[key] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[key] && <span className="text-red-600 text-xs mt-1">{errors[key]}</span>}
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Valider
        </button>
        {onCancel && (
          <button onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}
