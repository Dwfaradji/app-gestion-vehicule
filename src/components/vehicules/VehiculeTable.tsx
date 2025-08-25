import { Vehicule } from "@/types/vehicule";
import StatutBadge from "@/components/vehicules/StatutBadge";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/entretien";
import { formatDate } from "@/utils/formatDate";
import { AlertCircle } from "lucide-react";
import { Tooltip } from "react-tooltip";

interface TableProps {
    vehicules: Vehicule[];
    notifications: Notification[];
}

const VehiculeTable = ({ vehicules, notifications }: TableProps) => {
    const router = useRouter();

    // Fonction pour récupérer la couleur en fonction de la priorité
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
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {["Type", "Modèle", "Année", "Énergie", "Immatriculation", "Km", "Statut", "Prochaine révision", "CT", "Alertes"].map(
                        (t) => (
                            <th
                                key={t}
                                className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 tracking-wider"
                            >
                                {t}
                            </th>
                        )
                    )}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {vehicules.map((v) => {
                    const vehiculeAlertes = notifications.filter((n) => n.vehicleId === v.id);

                    const ctValide = v.ctValidite ? new Date(v.ctValidite) > new Date() : false;
                    const revisionDue = v.prochaineRevision ? new Date(v.prochaineRevision) < new Date() : false;

                    return (
                        <tr
                            key={v.id}
                            onClick={() => router.push(`/vehicules/${v.id}`)}
                            className="cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out"
                        >
                            <td className="px-4 py-3 text-sm text-gray-700">{v.type}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{v.modele}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{v.annee}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{v.energie}</td>

                            <td className="px-4 py-3 text-sm font-medium text-gray-900 flex items-center gap-2">
                                {v.immat}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">{v.km.toLocaleString()} km</td>
                            <td className="px-4 py-3 text-sm"><StatutBadge statut={v.statut} /></td>

                            <td className="px-4 py-3 text-sm">
                                {v.prochaineRevision ? (
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                        revisionDue ? "bg-red-100 text-red-700 animate-pulse" : "bg-green-100 text-green-700"
                                    }`}>
                                            {formatDate(v.prochaineRevision)} - {revisionDue ? "À refaire" : "OK"}
                                        </span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>

                            <td className="px-4 py-3 text-sm">
                                {v.ctValidite ? (
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                        ctValide ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700 animate-pulse"
                                    }`}>
                                            {formatDate(v.ctValidite)} - {ctValide ? "Valide" : "Expiré"}
                                        </span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>

                            {/* Colonne Alertes avec icône et tooltip priorité */}
                            <td className="px-4 py-3 text-sm text-center">
                                {vehiculeAlertes.length > 0 ? (
                                    <>
                                        <div data-tooltip-id={`tooltip-${v.id}`} className="inline-flex items-center gap-1 justify-center cursor-pointer">
                                            <AlertCircle className="h-4 w-4 text-red-600 animate-pulse" />
                                            <span className="text-red-600 font-semibold">{vehiculeAlertes.length}</span>
                                        </div>
                                        <Tooltip id={`tooltip-${v.id}`} place="top">
                                            <ul className="text-xs">
                                                {vehiculeAlertes.map((n) => (
                                                    <li key={n.id} className={getPriorityColor(n.priority)}>
                                                        {n.priority ? `[${n.priority.toUpperCase()}]` : ""} {n.message}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <span className="text-green-600 font-medium">RAS</span>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default VehiculeTable;