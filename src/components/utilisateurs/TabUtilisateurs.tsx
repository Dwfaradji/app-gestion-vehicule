// src/components/tabs/TabUtilisateurs.tsx
"use client";

import * as React from "react";
import { useUtilisateurs } from "@/context/utilisateursContext";
import type { Utilisateur } from "@/types/utilisateur";
import { formatDate } from "@/utils/formatDate";
import Table from "@/components/ui/Table";
import ActionButtons, { Action } from "@/components/ui/ActionButtons";
import confirmAndRun from "@/helpers/helperConfirmAndRun";
import getConfirmMessage from "@/helpers/helperConfirm";
import { useConfirm } from "@/hooks/useConfirm";

export default function TabUtilisateurs() {
  const { utilisateurs, updateUtilisateur, deleteUtilisateur } = useUtilisateurs();
  const { confirm, ConfirmContainer } = useConfirm();

  /** Affichage visuel du statut utilisateur */
  const renderStatus = (status: Utilisateur["status"]) => {
    const statusStyles: Record<string, string> = {
      APPROVED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
      PENDING: "bg-yellow-100 text-yellow-700",
    };

    const label: Record<string, string> = {
      APPROVED: "Validé",
      REJECTED: "Rejeté",
      PENDING: "En attente",
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
        {label[status] ?? status}
      </span>
    );
  };

  /** Suppression avec confirmation */
  const handleDeleteUtilisateur = async (utilisateur: Utilisateur) => {
    await confirmAndRun(
      confirm,
      {
        title: "Supprimer un utilisateur",
        message: getConfirmMessage({
          type: "supprimer-utilisateur",
          target: utilisateur,
        }),
        variant: "danger",
      },
      () => deleteUtilisateur(utilisateur.id),
    );
  };

  /** Validation ou rejet avec confirmation */
  const handleUpdateStatus = async (utilisateur: Utilisateur, newStatus: Utilisateur["status"]) => {
    await confirmAndRun(
      confirm,
      {
        title: newStatus === "APPROVED" ? "Valider un utilisateur" : "Rejeter un utilisateur",
        message: getConfirmMessage({
          type: newStatus === "APPROVED" ? "valider-utilisateur" : "rejeter-utilisateur",
          target: utilisateur,
        }),
        variant: newStatus === "APPROVED" ? "default" : "danger",
      },
      () => updateUtilisateur({ ...utilisateur, status: newStatus }),
    );
  };

  /** Colonnes du tableau */
  const columns = [
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
        const buttons: Action<Utilisateur>[] = [];

        if (u.status === "PENDING") {
          buttons.push({
            icon: "Check",
            color: "green",
            tooltip: "Valider",
            onClick: () => handleUpdateStatus(u, "APPROVED"),
          });
          buttons.push({
            icon: "X",
            color: "red",
            tooltip: "Rejeter",
            onClick: () => handleUpdateStatus(u, "REJECTED"),
          });
        }

        buttons.push({
          icon: "Trash2",
          color: "red",
          tooltip: "Supprimer",
          onClick: () => handleDeleteUtilisateur(u),
        });

        return <ActionButtons row={u} buttons={buttons} />;
      },
    },
  ];

  return (
    <div>
      {ConfirmContainer}
      <h2 className="text-xl font-bold mb-4">Gestion des utilisateurs</h2>
      <Table data={utilisateurs} columns={columns} />
    </div>
  );
}
