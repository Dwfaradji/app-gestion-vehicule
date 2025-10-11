"use client";

import React from "react";
import reparationsOptions from "@/data/reparationsOptions";
import type { Item } from "@/types/entretien";
import { maintenanceParams } from "@/data/maintenanceParams";
import formatDateForInput from "@/utils/formatDateForInput";
import FormField from "@/components/ui/FormField";

interface FormulaireItemProps {
  form: Item;
  setForm: (form: Item) => void;
  handleAddItem: () => void;
  setShowForm: (show: boolean) => void;
  options: {
    intervenant?: string[];
    kmPlaceholder?: string;
    activeTab: "Mécanique" | "Carrosserie" | "Révision" | "Dépenses";
  };
}

const FormulaireItem = ({
  form,
  setForm,
  handleAddItem,
  setShowForm,
  options,
}: FormulaireItemProps) => {
  /** 🔧 Gère les options dynamiques selon l’onglet */
  const renderReparations = () => {
    if (options.activeTab === "Mécanique") {
      return Object.entries(reparationsOptions["Mécanique"]).flatMap(([sousCat, reparations]) =>
        reparations.map((r) => `${sousCat} - ${r}`),
      );
    }

    if (options.activeTab === "Révision") return reparationsOptions["Révision générale"];

    if (options.activeTab === "Carrosserie") {
      return Object.entries(reparationsOptions["Carrosserie"]).flatMap(([sousCat, reparations]) =>
        reparations.map((r) => `${sousCat} - ${r}`),
      );
    }

    return [];
  };

  const reparationsList = renderReparations();

  /** 🧩 Rendu du formulaire */
  return (
    <div className="space-y-4 bg-gray-50 p-5 rounded-2xl shadow-sm mb-4 border border-gray-200">
      {/* Sélecteur de réparation */}
      {options.activeTab !== "Dépenses" && (
        <FormField
          label="Réparation"
          type="select"
          value={form.reparation ?? ""}
          onChange={(val) => {
            const reparation = val as string;
            const param = maintenanceParams.find((p) => p.type === reparation);
            setForm({
              ...form,
              reparation,
              itemId: Number(param?.id),
            });
          }}
          options={reparationsList}
        />
      )}

      {/* Sélecteur d’intervenant */}
      {options.intervenant && (
        <FormField
          label="Intervenant"
          type="select"
          value={form.intervenant ?? ""}
          onChange={(val) => setForm({ ...form, intervenant: val })}
          options={options.intervenant}
        />
      )}

      {/* Date */}
      <FormField
        label="Date"
        type="date"
        value={formatDateForInput(form.date)}
        onChange={(val) => setForm({ ...form, date: val })}
      />

      {/* Kilométrage */}
      <FormField
        label={options.kmPlaceholder || "Kilométrage"}
        type="number"
        value={form.km ?? ""}
        onChange={(val) => setForm({ ...form, km: val })}
      />

      {/* Montant */}
      <FormField
        label="Prix (€)"
        type="number"
        value={form.montant ?? ""}
        onChange={(val) => setForm({ ...form, montant: val })}
      />

      {/* Note */}
      <FormField
        label="Note (optionnelle)"
        type="text"
        value={form.note ?? ""}
        onChange={(val) => setForm({ ...form, note: val })}
      />

      {/* Boutons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleAddItem();
          }}
          className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-all"
        >
          Valider
        </button>

        <button
          onClick={() => setShowForm(false)}
          className="flex-1 rounded-xl bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400 transition-all"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default FormulaireItem;
