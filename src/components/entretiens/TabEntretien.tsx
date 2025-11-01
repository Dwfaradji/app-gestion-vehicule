"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";
import type { ParametreEntretien } from "@/types/entretien";
import Table from "@/components/ui/Table";
import ActionButtons, { type Action } from "@/components/ui/ActionButtons";
import FormField from "@/components/ui/FormField";
import { useParametresEntretien } from "@/context/parametresEntretienContext";
import confirmAndRun from "@/helpers/helperConfirmAndRun";
import getConfirmMessage from "@/helpers/helperConfirm";
import { useConfirm } from "@/hooks/useConfirm";

export default function TabEntretien() {
  const {
    parametresEntretien,
    addParametreEntretien,
    deleteParametreEntretien,
    updateParametreEntretien,
    resetParametreEntretien,
  } = useParametresEntretien();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<ParametreEntretien>>({});
  const [formEntretien, setFormEntretien] = useState<Partial<ParametreEntretien>>({});
  const [showFormEntretien, setShowFormEntretien] = useState(false);
  const { confirm, ConfirmContainer } = useConfirm();

  const categories: ParametreEntretien["category"][] = [
    "Mécanique",
    "Révision générale",
    "Carrosserie",
  ];

  const startEditing = (row: ParametreEntretien) => {
    setEditingRow(row.id);
    setEditValues({ seuilKm: row.seuilKm, alertKmBefore: row.alertKmBefore });
  };

  const cancelEditing = () => {
    setEditingRow(null);
    setEditValues({});
  };

  const saveEditing = async (row: ParametreEntretien) => {
    const updated: ParametreEntretien = {
      ...row,
      subCategory: row.subCategory ?? "",
      alertKmBefore: editValues.alertKmBefore ?? row.alertKmBefore ?? 0,
      seuilKm: editValues.seuilKm ?? row.seuilKm,
    };

    await confirmAndRun(
      confirm,
      {
        title: "Valider le Entretien",
        message: getConfirmMessage({ type: "valider-entretien", target: { type: updated.type } }),
        variant: "default",
      },
      () => updateParametreEntretien(updated),
    );

    setEditingRow(null);
  };

  const addNewParam = async () => {
    if (
      !formEntretien.type ||
      !formEntretien.category ||
      formEntretien.seuilKm === undefined ||
      formEntretien.itemId === undefined
    )
      return;

    const newParam: Omit<ParametreEntretien, "id"> = {
      itemId: formEntretien.itemId,
      type: formEntretien.type,
      category: formEntretien.category,
      subCategory: formEntretien.subCategory ?? "",
      seuilKm: formEntretien.seuilKm,
      alertKmBefore: formEntretien.alertKmBefore ?? 0,
    };

    await confirmAndRun(
      confirm,
      {
        title: "Valider le Entretien",
        message: getConfirmMessage({ type: "valider-entretien", target: { type: newParam.type } }),
        variant: "default",
      },
      () => addParametreEntretien(newParam),
    );

    setFormEntretien({});
    setShowFormEntretien(false);
  };
  const handleDeleteParam = async (param: ParametreEntretien) => {
    await confirmAndRun(
      confirm,
      {
        title: "Supprimer le Entretien",
        message: getConfirmMessage({ type: "supprimer-entretien", target: param }),
        variant: "danger",
      },
      () => deleteParametreEntretien(param.id),
    );
  };
  const handleResetParams = async () => {
    await confirmAndRun(
      confirm,
      {
        title: "Reinitialiser parametre Entretien",
        message: getConfirmMessage({ type: "reinitialiser-entretien" }),
        variant: "danger",
      },
      () => resetParametreEntretien(),
    );
  };

  const sortedParams = [...parametresEntretien].sort(
    (a, b) => categories.indexOf(a.category) - categories.indexOf(b.category),
  );

  return (
    <div>
      {ConfirmContainer}
      <h2 className="text-xl font-bold mb-4">Paramètres d&#39;entretien</h2>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setShowFormEntretien(!showFormEntretien)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Ajouter un paramètre
        </button>

        <button
          onClick={handleResetParams}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Réinitialiser les paramètres
        </button>
      </div>

      {showFormEntretien && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
          <FormField
            label="Type d’entretien: Vidange, Freins..."
            type="text"
            value={formEntretien.type ?? ""}
            onChange={(val: string | number) =>
              setFormEntretien({ ...formEntretien, type: String(val) })
            }
          />

          <FormField
            label="Catégorie"
            type="select"
            value={formEntretien.category ?? ""}
            onChange={(val: string | number) =>
              setFormEntretien({
                ...formEntretien,
                category: String(val) as ParametreEntretien["category"],
              })
            }
            options={categories}
          />

          <FormField
            label="Seuil Km"
            type="number"
            value={formEntretien.seuilKm !== undefined ? String(formEntretien.seuilKm) : ""}
            onChange={(val: string | number) =>
              setFormEntretien({ ...formEntretien, seuilKm: Number(val) })
            }
          />

          <FormField
            label="Alerte Km avant"
            type="number"
            value={
              formEntretien.alertKmBefore !== undefined ? String(formEntretien.alertKmBefore) : ""
            }
            onChange={(val: string | number) =>
              setFormEntretien({ ...formEntretien, alertKmBefore: Number(val) })
            }
          />

          <button
            onClick={addNewParam}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full font-semibold transition"
          >
            Valider
          </button>
        </div>
      )}

      <Table
        data={sortedParams}
        columns={[
          { key: "type", label: "Type" },
          { key: "category", label: "Catégorie" },
          {
            key: "seuilKm",
            label: "Seuil Km",
            render: (p) =>
              editingRow === p.id ? (
                <input
                  type="number"
                  value={editValues.seuilKm ?? p.seuilKm}
                  onChange={(e) =>
                    setEditValues({ ...editValues, seuilKm: Number(e.target.value) })
                  }
                  className="w-20 rounded border px-2 py-1"
                />
              ) : (
                p.seuilKm
              ),
          },
          {
            key: "alertKmBefore",
            label: "Alerte avant (Km)",
            render: (p) =>
              editingRow === p.id ? (
                <input
                  type="number"
                  value={editValues.alertKmBefore ?? p.alertKmBefore ?? ""}
                  onChange={(e) =>
                    setEditValues({ ...editValues, alertKmBefore: Number(e.target.value) })
                  }
                  className="w-20 rounded border px-2 py-1"
                />
              ) : (
                (p.alertKmBefore ?? "-")
              ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (p) => {
              const buttons: Action<ParametreEntretien>[] = [];

              if (editingRow === p.id) {
                buttons.push({
                  icon: "Save",
                  color: "green",
                  onClick: saveEditing,
                  tooltip: "Enregistrer",
                });
                buttons.push({
                  icon: "X",
                  color: "gray",
                  onClick: cancelEditing,
                  tooltip: "Annuler",
                });
              } else {
                buttons.push({
                  icon: "Pencil",
                  color: "blue",
                  onClick: startEditing,
                  tooltip: "Modifier",
                });
                buttons.push({
                  icon: "Trash2",
                  color: "red",
                  onClick: () => handleDeleteParam(p),
                  tooltip: "Supprimer",
                });
              }

              return <ActionButtons row={p} buttons={buttons} />;
            },
          },
        ]}
      />
    </div>
  );
}
