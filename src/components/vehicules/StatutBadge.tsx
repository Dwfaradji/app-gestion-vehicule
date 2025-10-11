import type { Vehicule } from "@/types/vehicule";

const StatutBadge = ({ statut }: { statut: Vehicule["statut"] }) => {
  const color = {
    Disponible: "bg-green-100 text-green-700",
    Maintenance: "bg-yellow-100 text-yellow-700",
    Incident: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${color}`}>
      {statut}
    </span>
  );
};

export default StatutBadge;
