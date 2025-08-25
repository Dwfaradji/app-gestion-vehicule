"use client";

import React from "react";
import FormulaireItem from "@/components/vehicules/FormulaireAdd";
import ListeItems from "@/components/entretiens/ListeInterventions";
import { Item } from "@/types/entretien";
import { Depense } from "@/types/depenses";
import { useVehiculeUpdater } from "@/hooks/useVehiculeUpdater";

interface Props {
    vehiculeId: number;
    activeTab: "Mécanique" | "Carrosserie" | "Révision" | "Dépenses";
    items: Item[];
    form: Item;
    setForm: (form: Item) => void;
    showForm: boolean;
    setShowForm: (show: boolean) => void;
    intervenant: string[];
    depenses: Depense[];
    addDepense: (d: Partial<Depense>) => Promise<void>;
    deleteDepense: (id: number, vehiculeId: number) => Promise<void>;
    refreshDepenses: (vehiculeId: number) => Promise<void>;
    vehiculeKm: number;
    prochaineRevision?: string;
    dateEntretien?: string;

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
    const { updateVehiculeSafe, loading } = useVehiculeUpdater();


    // 🔹 Ajout / mise à jour d’un item et du véhicule
    const handleAddItem = async (newItem: Item) => {
        const newKm = Math.max(newItem.km, vehiculeKm);
        let prochaineRevision = vehiculeProchaineRevision;
        let dateEntretien = vehiculeDateEntretien;

        if (activeTab === "Révision" && newItem.reparation === "Révision générale") {
            const nextDate = new Date(newItem.date);
            nextDate.setMonth(nextDate.getMonth() + 6);
            prochaineRevision = nextDate.toISOString();
        }

        if (activeTab === "Mécanique") {
            dateEntretien = new Date(newItem.date).toISOString();
        }

        // 🔹 Mise à jour centralisée du véhicule
        await updateVehiculeSafe(vehiculeId, {
            km: newKm,
            ...(prochaineRevision && { prochaineRevision }),
            ...(dateEntretien && { dateEntretien }),
        });

        // 🔹 Ajout de la dépense / intervention
        await addDepense({
            vehiculeId,
            categorie: activeTab,
            reparation: newItem.reparation,
            montant: newItem.montant ?? 0,
            km: newItem.km,
            note: newItem.note ?? "",
            date: newItem.date,
            intervenant: newItem.intervenant ?? "",
        });

        await refreshDepenses(vehiculeId);

        // 🔹 Reset du formulaire
        setForm({
            categorie: "", reparation: "", date: "", km: newKm, intervenant: "", note: "", montant: 0
        });
        setShowForm(false);
    };


    const handleDelete = async (depenseId: number) => {
        await deleteDepense(depenseId, vehiculeId);
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