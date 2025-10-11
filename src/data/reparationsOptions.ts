import { maintenanceCarrosseries, maintenanceParams } from "./maintenanceParams";

interface ReparationsOptions {
  Mécanique: Record<string, string[]>; // sous-catégories
  "Révision générale": string[];
  Carrosserie: Record<string, string[]>;
}

// 🔹 Sous-catégories possibles pour la mécanique
const mecaniqueGrouped: Record<string, string[]> = maintenanceParams
  .filter((p) => p.category === "Mécanique")
  .reduce(
    (acc, param) => {
      const group = param.subCategory || "Autres";
      if (!acc[group]) acc[group] = [];
      if (!acc[group].includes(param.type)) acc[group].push(param.type);
      return acc;
    },
    {} as Record<string, string[]>,
  );

// 🔹 Révision générale : liste plate
const revisionList: string[] = maintenanceParams
  .filter((p) => p.category === "Révision générale")
  .map((p) => p.type);

// 🔹 Sous-catégories possibles pour la carrosserie
const carrosserieList: Record<string, string[]> = maintenanceCarrosseries
  .filter((p) => p.category === "Carrosserie")
  .reduce(
    (acc, param) => {
      const group = param.subCategory || "Autres";
      if (!acc[group]) acc[group] = [];
      if (!acc[group].includes(param.type)) acc[group].push(param.type);
      return acc;
    },
    {} as Record<string, string[]>,
  );

export const reparationsOptions: ReparationsOptions = {
  Mécanique: mecaniqueGrouped,
  "Révision générale": revisionList,
  Carrosserie: carrosserieList,
};

export default reparationsOptions;
