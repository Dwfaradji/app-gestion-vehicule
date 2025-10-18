"use client";

import type { Vehicule } from "@/types/vehicule";
import type { Notification } from "@/types/entretien";
import { useRouter } from "next/navigation";
import StatutBadge from "@/components/vehicules/StatutBadge";
import { formatDate } from "@/utils/formatDate";
import { AlertCircle, Check } from "lucide-react";
import { Tooltip } from "react-tooltip";
import Table from "@/components/ui/Table";

interface TableProps {
  vehicules: Vehicule[];
  notifications: Notification[];
}

const VehiculeTable = ({ vehicules, notifications }: TableProps) => {
  const router = useRouter();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "moyen":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Table
      data={vehicules}
      onRowClick={(v) => router.push(`/vehicules/${v.id}`)}
      columns={[
        { key: "type", label: "Type" },
        { key: "modele", label: "Modèle" },
        { key: "annee", label: "Année" },
        { key: "energie", label: "Énergie" },

        {
          key: "immat",
          label: "Immatriculation",
          render: (v) => (
            <span className="flex items-center gap-2 font-medium text-gray-900">{v.immat}</span>
          ),
        },

        {
          key: "km",
          label: "Km",
          render: (v) => `${v.km.toLocaleString()} km`,
        },

        {
          key: "statut",
          label: "Statut",
          render: (v) => <StatutBadge statut={v.statut} />,
        },

        {
          key: "prochaineRevision",
          label: "Prochaine révision",
          render: (v) => {
            const revisionDue = v.prochaineRevision && new Date(v.prochaineRevision) < new Date();

            return v.prochaineRevision ? (
              <span
                className={`    inline-flex items-center justify-center
    w-20 sm:w-24 md:w-28
    rounded-full px-3 py-1.5
    text-xs font-semibold tracking-wide
    shadow-sm transition-colors duration-300 ease-in-out ${
      revisionDue ? "bg-red-100 text-red-700 animate-pulse" : "bg-green-100 text-green-700"
    }`}
              >
                {formatDate(v.prochaineRevision)}
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            );
          },
        },

        {
          key: "ctValidite",
          label: "CT",
          render: (v) => {
            const ctValide = v.ctValidite && new Date(v.ctValidite) > new Date();

            return v.ctValidite ? (
              <span
                className={`    inline-flex items-center justify-center
    w-20 sm:w-24 md:w-28
    rounded-full px-3 py-1.5
    text-xs font-semibold tracking-wide
    shadow-sm transition-colors duration-300 ease-in-out ${
      ctValide ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 animate-pulse"
    }`}
              >
                {formatDate(v.ctValidite)}
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            );
          },
        },

        {
          key: "alertes",
          label: "Alertes",
          align: "center",
          render: (v) => {
            const vehiculeAlertes = notifications.filter((n) => n.vehicleId === v.id);

            return vehiculeAlertes.length > 0 ? (
              <>
                <div
                  data-tooltip-id={`tooltip-${v.id}`}
                  className="inline-flex items-center gap-1 justify-center cursor-pointer"
                >
                  <AlertCircle className="h-4 w-4 text-red-600 animate-pulse" />
                  <span className="text-red-600 font-semibold">{vehiculeAlertes.length}</span>
                </div>

                <Tooltip id={`tooltip-${v.id}`} place="top">
                  <ul className="text-xs">
                    {vehiculeAlertes.map((n) => (
                      <li key={n.id} className={getPriorityColor(n.priority)}>
                        {n.priority ? `[${n.priority.toUpperCase()}] ` : ""}
                        {n.message}
                      </li>
                    ))}
                  </ul>
                </Tooltip>
              </>
            ) : (
              <Check className="text-green-600 font-medium" />
            );
          },
        },
      ]}
    />
  );
};

export default VehiculeTable;
