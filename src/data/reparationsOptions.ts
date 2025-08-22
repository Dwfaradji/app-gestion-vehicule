import maintenanceParams from "./maintenanceParams";

type Category = "Mécanique" | "Révision générale" | "Carrosserie";

// 🔹 Mécanique avec sous-catégories
const mecaniqueGrouped = maintenanceParams
    .filter(p => p.category === "Mécanique")
    .reduce((acc, param) => {
        const group = param.subCategory || "Autres";
        if (!acc[group]) acc[group] = [];
        acc[group].push(param.type);
        return acc;
    }, {} as Record<string, string[]>);

// 🔹 Révision générale (liste plate)
const revisionList = maintenanceParams
    .filter(p => p.category === "Révision générale")
    .map(p => p.type);

// 🔹 Carrosserie (liste plate)
const carrosserieList = maintenanceParams
    .filter(p => p.category === "Carrosserie")
    .map(p => p.type);

export const reparationsOptions: Record<Category, any> = {
    "Mécanique": mecaniqueGrouped,
    "Révision générale": revisionList,
    "Carrosserie": carrosserieList,
};

export default reparationsOptions;