import type { Vehicule } from "@/types/vehicule";

// Palette automatique pour les statuts
const defaultPalette = [
  "green", // 0 → Disponible
  "yellow", // 1 → Maintenance
  "red", // 2 → Incident
] as const;

const generateColorClass = (index: number) => {
  const color = defaultPalette[index % defaultPalette.length];
  return `bg-${color}-100 text-${color}-700`;
};

interface StatutBadgeProps {
  statut: Vehicule["statut"];
}

const StatutBadge = ({ statut }: StatutBadgeProps) => {
  const statuts: Vehicule["statut"][] = ["Disponible", "Maintenance", "Incident"];
  const index = statuts.indexOf(statut);
  const colorClass = index !== -1 ? generateColorClass(index) : "bg-gray-100 text-gray-700";

  return (
    <span
      className={`
    inline-flex items-center justify-center
    w-20 sm:w-24 md:w-28
    rounded-full px-3 py-1.5
    text-xs font-semibold uppercase tracking-wide
    shadow-sm transition-colors duration-300 ease-in-out
    ${colorClass}
  `}
    >
      {statut}
    </span>
  );
};

export default StatutBadge;
