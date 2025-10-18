"use client";

import React, { useState } from "react";
import reparationsOptions from "@/data/reparationsOptions";
import type { Item } from "@/types/entretien";
import formatDateForInput from "@/utils/formatDateForInput";
import FormField from "@/components/ui/FormField";

interface FormulaireItemProps {
  form: Partial<Item>;
  setForm: React.Dispatch<React.SetStateAction<Item>>;
  handleAddItem: () => void;
  setShowForm: (show: boolean) => void;
  options: {
    intervenant?: string[];
    activeTab: "Mécanique" | "Carrosserie" | "Révision" | "Dépenses";
  };
}

export default function FormulaireItem({
  form,
  setForm,
  handleAddItem,
  setShowForm,
  options,
}: FormulaireItemProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof Item, string>>>({});

  /** ⚙️ Liste dynamique des réparations selon l’onglet */
  const renderReparations = (): string[] => {
    if (options.activeTab === "Mécanique") {
      return Object.entries(reparationsOptions["Mécanique"]).flatMap(([sousCat, reparations]) =>
        reparations.map((r) => `${sousCat} - ${r}`),
      );
    }
    if (options.activeTab === "Révision") {
      return reparationsOptions["Révision générale"];
    }
    if (options.activeTab === "Carrosserie") {
      return Object.entries(reparationsOptions["Carrosserie"]).flatMap(([sousCat, reparations]) =>
        reparations.map((r) => `${sousCat} - ${r}`),
      );
    }
    return [];
  };

  const reparationsList = renderReparations();

  /** 🧠 Gestion des changements de champ */
  const handleChange = <K extends keyof Item>(field: K, value: Item[K] | string | number) => {
    // ✅ Les champs number sont traités comme chaînes vides tant que l’utilisateur n’a rien saisi
    if (typeof value === "string" && value.trim() === "") {
      setForm((prev) => ({ ...prev, [field]: undefined }));
      return;
    }

    if (typeof form[field] === "number" || field === "km" || field === "montant") {
      setForm((prev) => ({ ...prev, [field]: Number(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value as Item[K] }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /** ✅ Validation du formulaire */
  const validateForm = () => {
    const requiredFields: (keyof Item)[] = ["date", "km", "montant"];
    if (options.activeTab !== "Dépenses") requiredFields.unshift("reparation");

    const newErrors: Partial<Record<keyof Item, string>> = {};

    requiredFields.forEach((f) => {
      if (!form[f] && form[f] !== 0) newErrors[f] = `Le champ ${f} est requis`;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** 💾 Validation du formulaire */
  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    handleAddItem();
  };

  /** 🧩 Champs du formulaire */
  const fields: Array<{
    label: string;
    type: "text" | "number" | "select" | "date";
    key: keyof Item;
    value?: string | number | Date | null;
    options?: string[] | number[];
    disabled?: boolean;
    pattern?: string;
  }> = [
    ...(options.activeTab !== "Dépenses"
      ? [
          {
            label: "Réparation",
            type: "select" as const,
            key: "reparation" as const,
            value: form.reparation,
            options: reparationsList,
          },
        ]
      : []),

    ...(options.intervenant
      ? [
          {
            label: "Intervenant",
            type: "select" as const,
            key: "intervenant" as const,
            value: form.intervenant,
            options: options.intervenant,
          },
        ]
      : []),

    {
      label: "Date",
      type: "date" as const,
      key: "date" as const,
      value: form.date ? formatDateForInput(form.date as string) : "",
    },
    {
      label: "Kilométrage",
      type: "number" as const,
      key: "km" as const,
      // ✅ Forçage à chaîne vide si undefined/null
      value: form.km ?? "",
    },
    {
      label: "Prix (€)",
      type: "number" as const,
      key: "montant" as const,
      value: form.montant ?? "",
    },
    {
      label: "Note (optionnelle)",
      type: "text" as const,
      key: "note" as const,
      value: form.note ?? "",
    },
  ];

  /** 🎨 Rendu */
  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4">Nouvel élément</h3>

      <form onSubmit={handleValidate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <FormField
            key={f.key}
            label={f.label}
            type={f.type}
            value={f.value === 0 ? "" : f.value} // ✅ Empêche l’affichage du 0
            onChange={(val) => handleChange(f.key, val)}
            options={f.options}
            disabled={f.disabled}
            error={errors[f.key]}
          />
        ))}

        <div className="col-span-2 flex justify-center mt-6 gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition"
          >
            Valider
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-medium shadow hover:bg-gray-400 transition"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
