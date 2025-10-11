// src/components/tabs/TabUtilisateurs.tsx
"use client";

import * as React from "react";
import { useUtilisateurs } from "@/context/utilisateursContext";
import type { Utilisateur } from "@/types/utilisateur";
import { formatDate } from "@/utils/formatDate";
import type { ConfirmAction } from "@/types/actions";
import Table from "@/components/ui/Table";
import ActionButtons, { Action } from "@/components/ui/ActionButtons";

interface Props {
  utilisateurs: Utilisateur[];
  setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabUtilisateurs({ utilisateurs, setConfirmAction }: Props) {
  const { updateUtilisateur } = useUtilisateurs();

  const renderStatus = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
            Validé
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
            Rejeté
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
            En attente
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestion des utilisateurs</h2>

      <Table
        data={utilisateurs}
        columns={[
          { key: "name", label: "Nom" },
          { key: "fonction", label: "Fonction" },
          {
            key: "createdAt",
            label: "Date d'inscription",
            render: (u: Utilisateur) => formatDate(new Date(u.createdAt)),
          },
          {
            key: "status",
            label: "Statut",
            render: (u: Utilisateur) => renderStatus(u.status),
          },
          {
            key: "actions",
            label: "Actions",
            render: (u: Utilisateur) => {
              // Construction explicite du tableau buttons
              const buttons: Action<Utilisateur>[] = [];

              if (u.status === "PENDING") {
                buttons.push({
                  icon: "Check",
                  color: "green",
                  onClick: () => updateUtilisateur({ ...u, status: "APPROVED" }),
                  tooltip: "Valider",
                });
                buttons.push({
                  icon: "X",
                  color: "red",
                  onClick: () => updateUtilisateur({ ...u, status: "REJECTED" }),
                  tooltip: "Rejeter",
                });
              }

              buttons.push({
                icon: "Trash2",
                color: "red",
                onClick: () => setConfirmAction({ type: "supprimer-utilisateur", target: u }),
                tooltip: "Supprimer",
              });

              return <ActionButtons row={u} buttons={buttons} />;
            },
          },
        ]}
      />
    </div>
  );
}
