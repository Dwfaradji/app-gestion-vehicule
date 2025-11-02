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
import { Button } from "@/components/ui/Button";

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
    console.log("OK");
    if (
      !formEntretien.type ||
      !formEntretien.category ||
      !formEntretien.seuilKm
      // formEntretien.itemId == undefined // TODO: ItemeId dois etre obligatoire et unique enlever itemID=0
    )
      return;

    const newParam: Omit<ParametreEntretien, "id"> = {
      itemId: formEntretien.itemId ?? 0, // ICI
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
        <Button
          variant="success"
          onClick={() => setShowFormEntretien(!showFormEntretien)}
          className=""
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Ajouter un paramètre
        </Button>

        <Button variant="danger" onClick={handleResetParams} className="">
          Réinitialiser les paramètres
        </Button>
      </div>

      {showFormEntretien && (
        <div className="mb-10 p-4 bg-gray-50 rounded-lg shadow-sm  flex flex-col gap-y-10 justify-between items-center">
          <div className=" flex gap-4 justify-between items-center">
            <FormField
              label="Type: Vidange, Freins..."
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
          </div>
          <div className="flex justify-center ">
            <Button
              variant="success"
              onClick={addNewParam}
              className=" flex justify-center items-center gap-2"
            >
              Valider
            </Button>
          </div>
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
