import { Vehicule } from "@/types/vehicule";
import StatutBadge from "@/components/StatutBadge";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/entretien";

interface TableProps {
    vehicules: Vehicule[];
    notifications: Notification[];
}

const VehiculeTable = ({ vehicules, notifications }: TableProps) => {
    const router = useRouter();

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {["Type", "Modèle", "Année", "Énergie", "Immatriculation", "Km", "Statut", "Prochaine révision", "CT", "Alertes"].map(
                        (t) => (
                            <th
                                key={t}
                                className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500"
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
                    return (
                        <tr
                            key={v.id}
                            onClick={() => router.push(`/vehicules/${v.id}`)}
                            className="cursor-pointer hover:bg-blue-50"
                        >
                            <td className="px-4 py-3 text-sm text-gray-700">{v.type}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{v.modele}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{v.annee}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{v.energie}</td>

                            {/* Immatriculation + badge notifications */}
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 flex items-center gap-2">
                                {v.immat}
                                {vehiculeAlertes.length > 0 && (
                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                                        {vehiculeAlertes.length}
                                    </span>
                                )}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">{v.km} km</td>
                            <td className="px-4 py-3 text-sm"><StatutBadge statut={v.statut} /></td>
                            <td className="px-4 py-3 text-sm text-gray-700">{v.prochaineRevision}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{v.ctValidite}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {vehiculeAlertes.length > 0 ? (
                                    <span className="text-red-600 font-semibold">{vehiculeAlertes.length} alerte{vehiculeAlertes.length > 1 ? "s" : ""}</span>
                                ) : (
                                    <span className="text-green-600">RAS</span>
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