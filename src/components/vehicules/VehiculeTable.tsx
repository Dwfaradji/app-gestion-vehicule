"use client";

import { Vehicule } from "@/types/vehicule";
import { Notification } from "@/types/entretien";
import { useRouter } from "next/navigation";
import StatutBadge from "@/components/vehicules/StatutBadge";
import { formatDate } from "@/utils/formatDate";
import { AlertCircle } from "lucide-react";
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
                        <span className="flex items-center gap-2 font-medium text-gray-900">
              {v.immat}
            </span>
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
                        const revisionDue =
                            v.prochaineRevision &&
                            new Date(v.prochaineRevision) < new Date();

                        return v.prochaineRevision ? (
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    revisionDue
                                        ? "bg-red-100 text-red-700 animate-pulse"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                {formatDate(v.prochaineRevision)} -{" "}
                                {revisionDue ? "À refaire" : "OK"}
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
                        const ctValide =
                            v.ctValidite && new Date(v.ctValidite) > new Date();

                        return v.ctValidite ? (
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    ctValide
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700 animate-pulse"
                                }`}
                            >
                {formatDate(v.ctValidite)} - {ctValide ? "Valide" : "Expiré"}
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
                        const vehiculeAlertes = notifications.filter(
                            (n) => n.vehicleId === v.id
                        );

                        return vehiculeAlertes.length > 0 ? (
                            <>
                                <div
                                    data-tooltip-id={`tooltip-${v.id}`}
                                    className="inline-flex items-center gap-1 justify-center cursor-pointer"
                                >
                                    <AlertCircle className="h-4 w-4 text-red-600 animate-pulse" />
                                    <span className="text-red-600 font-semibold">
                    {vehiculeAlertes.length}
                  </span>
                                </div>

                                <Tooltip id={`tooltip-${v.id}`} place="top">
                                    <ul className="text-xs">
                                        {vehiculeAlertes.map((n) => (
                                            <li
                                                key={n.id}
                                                className={getPriorityColor(n.priority)}
                                            >
                                                {n.priority
                                                    ? `[${n.priority.toUpperCase()}] `
                                                    : ""}
                                                {n.message}
                                            </li>
                                        ))}
                                    </ul>
                                </Tooltip>
                            </>
                        ) : (
                            <span className="text-green-600 font-medium">RAS</span>
                        );
                    },
                },
            ]}
        />
    );
};

export default VehiculeTable;