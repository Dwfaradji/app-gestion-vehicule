"use client";

import React, { useState } from "react";
import type { Vehicule } from "@/types/vehicule";
import { Plus } from "lucide-react";
import type { ConfirmAction } from "@/types/actions";
import FormField from "@/components/ui/FormField";
import Table from "@/components/ui/Table";
import ActionButtons from "@/components/ui/ActionButtons";
import {
  constructeurs,
  types,
  energies,
  statuts,
  nombrePlaces,
  motorisations,
  chevauxFiscaux,
} from "@/data/vehiculeData";

interface Props {
  vehicules: Vehicule[];
  setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabVehicules({ vehicules, setConfirmAction }: Props) {
  const [formVehicule, setFormVehicule] = useState<Partial<Vehicule>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof Vehicule, string>>>({});
  const [showFormVehicule, setShowFormVehicule] = useState(false);

  const handleChange = <K extends keyof Vehicule>(
    field: K,
    value: Vehicule[K] | string | number,
  ) => {
    let val: Vehicule[K] = value as Vehicule[K];

    // Gestion des nombres
    if (typeof formVehicule[field] === "number") {
      val = Number(value) >= 0 ? (Number(value) as Vehicule[K]) : (0 as Vehicule[K]);
    }

    // Gestion immatriculation
    if (field === "immat" && typeof value === "string") {
      val = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .replace(/^([A-Z]{0,2})([0-9]{0,3})([A-Z]{0,2}).*$/, "$1-$2-$3") as Vehicule[K];
    }

    // Gestion VIN
    if (field === "vim" && typeof value === "string") {
      val = value
        .toUpperCase()
        .replace(/[^A-HJ-NPR-Z0-9]/g, "")
        .slice(0, 17) as Vehicule[K];
    }

    setFormVehicule((prev) => ({ ...prev, [field]: val }));

    // Reset modèle si constructeur changé
    if (field === "constructeur") setFormVehicule((prev) => ({ ...prev, modele: "" }));

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const requiredFields: (keyof Vehicule)[] = [
      "type",
      "constructeur",
      "modele",
      "km",
      "annee",
      "energie",
      "prixAchat",
      "dateEntretien",
      "statut",
      "prochaineRevision",
      "immat",
      "ctValidite",
      "vim",
      "places",
      "motorisation",
      "chevauxFiscaux",
    ];

    const newErrors: Partial<Record<keyof Vehicule, string>> = {};

    requiredFields.forEach((f) => {
      if (!formVehicule[f] && formVehicule[f] !== 0) newErrors[f] = `Le champ ${f} est requis`;
    });

    if (formVehicule.immat && !/^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(formVehicule.immat as string)) {
      newErrors.immat = "Immatriculation invalide (AA-123-BB)";
    }

    if (formVehicule.vim && (formVehicule.vim as string).length !== 17) {
      newErrors.vim = "Le VIN doit contenir 17 caractères (sans I,O,Q)";
    }

    setErrors(newErrors as Record<keyof Vehicule, string>);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidate = () => {
    if (!validateForm()) return;
    setConfirmAction({ type: "valider-vehicule", target: formVehicule });
    setShowFormVehicule(false);
  };

  const isFieldValid = (key: keyof Vehicule, value: unknown) => {
    if (value === undefined || value === null || value === "") return false;
    if (key === "immat") return /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(value as string);
    if (key === "vim") return /^[A-HJ-NPR-Z0-9]{17}$/.test(value as string);
    return true;
  };

  const selectedConstructeur = formVehicule.constructeur || "";

  const fields: Array<{
    label: string;
    type: "text" | "number" | "select" | "date";
    key: keyof Vehicule;
    value?: string | number | Date | null;
    options?: string[] | number[];
    disabled?: boolean;
    pattern?: string;
  }> = [
    { label: "Type", type: "select", key: "type", value: formVehicule.type, options: types },
    {
      label: "Constructeur",
      type: "select",
      key: "constructeur",
      value: formVehicule.constructeur,
      options: Object.keys(constructeurs),
    },
    {
      label: "Modèle",
      type: "select",
      key: "modele",
      value: formVehicule.modele,
      options: selectedConstructeur
        ? constructeurs[selectedConstructeur as keyof typeof constructeurs]
        : [],
      disabled: !selectedConstructeur,
    },
    { label: "Kilométrage", type: "number", key: "km", value: formVehicule.km },
    { label: "Année", type: "number", key: "annee", value: formVehicule.annee },
    {
      label: "Énergie",
      type: "select",
      key: "energie",
      value: formVehicule.energie,
      options: energies,
    },
    { label: "Prix d'achat (€)", type: "number", key: "prixAchat", value: formVehicule.prixAchat },
    {
      label: "Date entretien",
      type: "date",
      key: "dateEntretien",
      value: formVehicule.dateEntretien,
    },
    {
      label: "Statut",
      type: "select",
      key: "statut",
      value: formVehicule.statut,
      options: statuts,
    },
    {
      label: "Prochaine révision",
      type: "date",
      key: "prochaineRevision",
      value: formVehicule.prochaineRevision,
    },
    {
      label: "Immatriculation (AA-123-BB)",
      type: "text",
      key: "immat",
      value: formVehicule.immat,
      pattern: "[A-Z]{2}-[0-9]{3}-[A-Z]{2}",
    },
    { label: "CT validité", type: "date", key: "ctValidite", value: formVehicule.ctValidite },
    { label: "VIM (VIN)", type: "text", key: "vim", value: formVehicule.vim },
    {
      label: "Nombre de places",
      type: "select",
      key: "places",
      value: formVehicule.places,
      options: nombrePlaces,
    },
    {
      label: "Motorisation",
      type: "select",
      key: "motorisation",
      value: formVehicule.motorisation,
      options: motorisations,
    },
    {
      label: "Chevaux fiscaux",
      type: "select",
      key: "chevauxFiscaux",
      value: formVehicule.chevauxFiscaux,
      options: chevauxFiscaux,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Liste des véhicules</h2>

      <button
        onClick={() => setShowFormVehicule(!showFormVehicule)}
        className="flex items-center gap-2 mb-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        <Plus className="w-4 h-4" /> Ajouter un véhicule
      </button>

      {showFormVehicule && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {fields
            .filter((f) => f.type !== "date")
            .map((f) => (
              <FormField
                key={f.key}
                label={f.label}
                type={f.type as "select" | "text" | "number" | "date"}
                value={f.value}
                options={f.options}
                onChange={(v) => handleChange(f.key, v)}
                disabled={f.disabled}
                pattern={f.pattern}
                error={errors[f.key]}
                valid={isFieldValid(f.key, f.value)}
              />
            ))}

          <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields
              .filter((f) => f.type === "date")
              .map((f) => (
                <FormField
                  key={f.key}
                  label={f.label}
                  type="date"
                  value={f.value}
                  onChange={(v) => handleChange(f.key, v)}
                  error={errors[f.key]}
                  valid={isFieldValid(f.key, f.value)}
                />
              ))}
          </div>

          <div className="col-span-2 flex justify-center mt-4">
            <button
              onClick={handleValidate}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition"
            >
              Valider
            </button>
          </div>
        </div>
      )}

      <Table
        data={vehicules}
        columns={[
          { key: "type", label: "Type" },
          { key: "constructeur", label: "Constructeur" },
          { key: "modele", label: "Modèle" },
          { key: "km", label: "Km", render: (v: Vehicule) => `${v.km?.toLocaleString() ?? 0} km` },
          { key: "immat", label: "Immat" },
          {
            key: "actions",
            label: "Actions",
            render: (v: Vehicule) => (
              <ActionButtons
                row={v}
                buttons={[
                  {
                    icon: "Trash2",
                    color: "red",
                    tooltip: "Supprimer",
                    onClick: (r: Vehicule) =>
                      setConfirmAction({ type: "supprimer-vehicule", target: r }),
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
