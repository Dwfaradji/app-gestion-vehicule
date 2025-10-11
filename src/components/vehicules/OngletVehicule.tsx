"use client";

import React from "react";
import FormulaireItem from "@/components/vehicules/FormulaireAdd";
import ListeItems from "@/components/entretiens/ListeInterventions";
import type { Item } from "@/types/entretien";
import type { Depense } from "@/types/depenses";
import { useVehiculeUpdater } from "@/hooks/useVehiculeUpdater";
import { useNotifications } from "@/hooks/useNotifications";
import formatDateForInput from "@/utils/formatDateForInput";

interface Props {
  vehiculeId: number;
  activeTab: "Mécanique" | "Carrosserie" | "Révision" | "Dépenses";
  items: Item[];
  form: Item;
  setForm: (form: Item) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  intervenant: string[];
  addDepense: (d: Partial<Depense>) => Promise<void>;
  deleteDepense: (id: number, vehiculeId: number) => Promise<void>;
  refreshDepenses: (vehiculeId: number) => Promise<void>;
  vehiculeKm: number;
  prochaineRevision?: string | Date;
  dateEntretien?: string | Date;
}

const OngletVehicule = ({
  vehiculeId,
  activeTab,
  items,
  form,
  setForm,
  showForm,
  setShowForm,
  intervenant,
  addDepense,
  deleteDepense,
  refreshDepenses,
  vehiculeKm,
  prochaineRevision: vehiculeProchaineRevision,
  dateEntretien: vehiculeDateEntretien,
}: Props) => {
  const { updateVehiculeSafe } = useVehiculeUpdater();

  const { refreshVehicle } = useNotifications();

  const handleAddItem = async (newItem: Item) => {
    const newKm = Math.max(newItem.km, vehiculeKm);
    let prochaineRevision = vehiculeProchaineRevision;
    let dateEntretien = vehiculeDateEntretien;

    if (!newItem.itemId && newItem.id) {
      console.error("Erreur : itemId non défini pour cette intervention !");
      return;
    }

    const itemDate = formatDateForInput(newItem.date); // ✅ date sécurisée

    if (activeTab === "Révision" && newItem.reparation === "Révision générale") {
      const nextDate = new Date(itemDate);
      nextDate.setMonth(nextDate.getMonth() + 6);
      prochaineRevision = formatDateForInput(nextDate);
    }

    if (activeTab === "Mécanique") {
      dateEntretien = itemDate;
    }

    // 🔹 Mise à jour véhicule
    await updateVehiculeSafe(vehiculeId, {
      km: newKm,
      ...(prochaineRevision && {
        prochaineRevision:
          typeof prochaineRevision === "string"
            ? prochaineRevision
            : prochaineRevision.toISOString(),
      }),
      ...(dateEntretien && {
        dateEntretien:
          typeof dateEntretien === "string" ? dateEntretien : dateEntretien.toISOString(),
      }),
    });
    // 🔹 Ajout dépense
    await addDepense({
      vehiculeId,
      itemId: newItem.itemId,
      categorie: activeTab,
      reparation: newItem.reparation,
      montant: newItem.montant ?? 0,
      km: newItem.km,
      note: newItem.note ?? "",
      date: itemDate,
      intervenant: newItem.intervenant ?? "",
    });

    // 🔹 Reset formulaire
    setForm({
      categorie: "",
      reparation: "",
      date: itemDate, // ✅ garde la date du jour par défaut
      km: newKm,
      intervenant: "",
      note: "",
      montant: 0,
      itemId: 0,
    });
    setShowForm(false);

    // 🔹 Rafraîchir les notifications du véhicule
    await refreshVehicle(vehiculeId);
  };

  const handleDelete = async (depenseId: number) => {
    await deleteDepense(depenseId, vehiculeId);
    await refreshDepenses(vehiculeId);
  };
  return (
    <div>
      {activeTab !== "Dépenses" && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 mb-4"
        >
          + Ajouter
        </button>
      )}

      {showForm && activeTab !== "Dépenses" && (
        <FormulaireItem
          form={form}
          setForm={setForm}
          handleAddItem={() => handleAddItem(form)}
          setShowForm={setShowForm}
          options={{ intervenant, kmPlaceholder: "Kilométrage", activeTab }}
        />
      )}

      {activeTab !== "Dépenses" && (
        <ListeItems items={items} activeTab={activeTab} handleDelete={handleDelete} />
      )}
    </div>
  );
};

export default OngletVehicule;
