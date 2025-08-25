import maintenanceParams from "./maintenanceParams";

type Category = "Mécanique" | "Révision générale" | "Carrosserie";

interface ReparationsOptions {
    "Mécanique": Record<string, string[]>; // sous-catégories
    "Révision générale": string[];
    "Carrosserie": string[];
}

// 🔹 Sous-catégories possibles pour la mécanique
const mecaniqueGrouped: Record<string, string[]> = maintenanceParams
    .filter(p => p.category === "Mécanique")
    .reduce((acc, param) => {
        const group = param.subCategory || "Autres";
        if (!acc[group]) acc[group] = [];
        if (!acc[group].includes(param.type)) acc[group].push(param.type);
        return acc;
    }, {} as Record<string, string[]>);

// 🔹 Révision générale : liste plate
const revisionList: string[] = maintenanceParams
    .filter(p => p.category === "Révision générale")
    .map(p => p.type);

// 🔹 Carrosserie : liste plate
const carrosserieList: string[] = maintenanceParams
    .filter(p => p.category === "Carrosserie")
    .map(p => p.type);

export const reparationsOptions: ReparationsOptions = {
    "Mécanique": mecaniqueGrouped,
    "Révision générale": revisionList,
    "Carrosserie": carrosserieList,
};

export default reparationsOptions;