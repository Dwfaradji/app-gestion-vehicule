"use client";

import React, { useState } from "react";
import { useTrajets } from "@/context/trajetsContext";
import Table from "@/components/ui/Table";
import ActionButtons from "@/components/ui/ActionButtons";
import FormField from "@/components/ui/FormField";
import confirmAndRun from "@/helpers/helperConfirmAndRun";
import getConfirmMessage from "@/helpers/helperConfirm";
import { useConfirm } from "@/hooks/useConfirm";
import { Conducteur } from "@/types/trajet";

export default function TabConducteurs() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [loading, setLoading] = useState(false);
  const { conducteurs, addConducteur, deleteConducteur } = useTrajets();
  const [touched] = useState({ nom: false, prenom: false });
  const { confirm, ConfirmContainer } = useConfirm();

  const handleAddConducteur = async () => {
    if (!nom || !prenom) return alert("Nom et prénom requis");

    setLoading(true);
    try {
      await confirmAndRun(
        confirm,
        {
          title: "Ajouter un conducteur",
          message: getConfirmMessage({ type: "ajouter-conducteur", target: { nom, prenom } }),
          variant: "default",
        },
        () => addConducteur({ nom, prenom }),
      );

      setNom("");
      setPrenom("");
    } catch (error) {
      console.error(error);
      alert("Impossible d’ajouter le conducteur");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConducteur = async (conducteur: Conducteur) => {
    console.log(conducteur);
    try {
      await confirmAndRun(
        confirm,
        {
          title: "Supprimer un Conducteur",
          message: getConfirmMessage({ type: "supprimer-conducteur", target: conducteur }),
          variant: "danger",
        },
        () => deleteConducteur(conducteur.id),
      );
    } catch (error) {
      console.error(error);
      alert("Impossible de supprimer le conducteur");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestion des conducteurs</h2>

      {/* Formulaire ajout */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-end">
        <div className="flex-1">
          <FormField
            label="Nom"
            type="text"
            value={nom}
            onChange={(val) => setNom(val)}
            error={touched.nom && !nom ? "Champ requis" : undefined}
          />
        </div>

        <div className="flex-1">
          <FormField
            label="Prénom"
            type="text"
            value={prenom}
            onChange={(val) => setPrenom(val)}
            error={touched.prenom && !prenom ? "Champ requis" : undefined}
          />
        </div>

        <div>
          <button
            onClick={handleAddConducteur}
            disabled={loading || !nom || !prenom}
            className={`bg-blue-600 text-white px-5 py-2 rounded-xl font-medium shadow-sm transition-all ${
              loading || !nom || !prenom
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </div>
      {/* Table réutilisable */}
      <Table
        data={conducteurs}
        columns={[
          { key: "nom", label: "Nom" },
          { key: "prenom", label: "Prénom" },
          {
            key: "code",
            label: "Code",
            render: (c) => <span className="font-mono">{c.code}</span>,
          },
          {
            key: "actions",
            label: "Actions",
            render: (c) => (
              <ActionButtons
                row={c}
                buttons={[
                  {
                    icon: "Trash2",
                    color: "red",
                    onClick: () => handleDeleteConducteur(c),
                    tooltip: "Supprimer le conducteur",
                  },
                ]}
              />
            ),
          },
        ]}
      />
      {ConfirmContainer}
    </div>
  );
}
