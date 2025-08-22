export type VehicleType = "Berline" | "SUV" | "Utilitaire";

export interface MaintenanceParam {
    type: string;
    category: "Mécanique" | "Révision générale" | "Carrosserie";
    subCategory?: string; // 🔹 Nouvelle propriété
    seuilKm: number;
    alertKmBefore?: number;
    description?: string;
    applicableTo?: VehicleType[];
}

// 🔹 Liste ultra complète
export const maintenanceParams: MaintenanceParam[] = [
    // ---------------------------
    // FREINS
    { type: "Plaquettes avant", category: "Mécanique", subCategory: "Freins", seuilKm: 60000, alertKmBefore: 5000 },
    { type: "Plaquettes arrière", category: "Mécanique", subCategory: "Freins", seuilKm: 60000, alertKmBefore: 5000 },
    { type: "Disques avant", category: "Mécanique", subCategory: "Freins", seuilKm: 120000, alertKmBefore: 5000 },
    { type: "Disques arrière", category: "Mécanique", subCategory: "Freins", seuilKm: 120000, alertKmBefore: 5000 },
    { type: "Liquide de frein", category: "Mécanique", subCategory: "Freins", seuilKm: 30000, alertKmBefore: 2000 },

    // ---------------------------
    // HUILE ET FILTRES
    { type: "Vidange moteur", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 15000, alertKmBefore: 2000 },
    { type: "Filtre à huile", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 15000, alertKmBefore: 2000 },
    { type: "Filtre à air moteur", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 30000, alertKmBefore: 3000 },
    { type: "Filtre à carburant", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 40000, alertKmBefore: 3000 },
    { type: "Filtre habitacle", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 20000, alertKmBefore: 2000 },

    // ---------------------------
    // COURROIES ET CHAÎNES
    { type: "Courroie de distribution", category: "Mécanique", subCategory: "Distribution", seuilKm: 120000, alertKmBefore: 5000 },
    { type: "Courroie accessoires", category: "Mécanique", subCategory: "Distribution", seuilKm: 60000, alertKmBefore: 5000 },
    { type: "Chaîne de distribution", category: "Mécanique", subCategory: "Distribution", seuilKm: 150000, alertKmBefore: 5000 },

    // ---------------------------
    // TRANSMISSION / EMBRAYAGE
    { type: "Embrayage", category: "Mécanique", subCategory: "Transmission", seuilKm: 150000, alertKmBefore: 5000 },
    { type: "Liquide de transmission", category: "Mécanique", subCategory: "Transmission", seuilKm: 60000, alertKmBefore: 5000 },
    { type: "Cardans / joints homocinétiques", category: "Mécanique", subCategory: "Transmission", seuilKm: 100000, alertKmBefore: 5000 },

    // ---------------------------
    // SUSPENSION / DIRECTION
    { type: "Amortisseurs avant", category: "Mécanique", subCategory: "Suspension", seuilKm: 80000, alertKmBefore: 5000 },
    { type: "Amortisseurs arrière", category: "Mécanique", subCategory: "Suspension", seuilKm: 80000, alertKmBefore: 5000 },
    { type: "Rotules de direction", category: "Mécanique", subCategory: "Direction", seuilKm: 80000, alertKmBefore: 5000 },
    { type: "Biellettes de barre stabilisatrice", category: "Mécanique", subCategory: "Direction", seuilKm: 80000, alertKmBefore: 5000 },
    { type: "Bras de suspension", category: "Mécanique", subCategory: "Suspension", seuilKm: 100000, alertKmBefore: 5000 },

    // ---------------------------
    // ÉLECTRIQUE / ALLUMAGE
    { type: "Bougies d’allumage", category: "Mécanique", subCategory: "Allumage", seuilKm: 40000, alertKmBefore: 2000 },
    { type: "Batterie", category: "Mécanique", subCategory: "Électrique", seuilKm: 60000, alertKmBefore: 3000 },

    // ---------------------------
    // PNEUS ET ROUES
    { type: "Pneus avant", category: "Mécanique", subCategory: "Pneus", seuilKm: 40000, alertKmBefore: 3000 },
    { type: "Pneus arrière", category: "Mécanique", subCategory: "Pneus", seuilKm: 40000, alertKmBefore: 3000 },
    { type: "Pression pneus", category: "Mécanique", subCategory: "Pneus", seuilKm: 5000, alertKmBefore: 500 },

    // ---------------------------
    // LIQUIDES DIVERS
    { type: "Liquide de refroidissement", category: "Mécanique", subCategory: "Liquides", seuilKm: 60000, alertKmBefore: 3000 },
    { type: "Liquide de lave-glace", category: "Mécanique", subCategory: "Liquides", seuilKm: 10000, alertKmBefore: 1000 },

    // ---------------------------
    // MOTEUR
    { type: "Pompe à eau", category: "Mécanique", subCategory: "Moteur", seuilKm: 120000, alertKmBefore: 5000 },
    { type: "Alternateur", category: "Mécanique", subCategory: "Moteur", seuilKm: 120000, alertKmBefore: 5000 },
    { type: "Démarreur", category: "Mécanique", subCategory: "Moteur", seuilKm: 150000, alertKmBefore: 5000 },
    { type: "Injecteurs", category: "Mécanique", subCategory: "Moteur", seuilKm: 100000, alertKmBefore: 5000 },
    { type: "Turbocompresseur", category: "Mécanique", subCategory: "Moteur", seuilKm: 200000, alertKmBefore: 10000 },
    { type: "Soupapes et culasse", category: "Mécanique", subCategory: "Moteur", seuilKm: 150000, alertKmBefore: 5000 },

    // ---------------------------
    // RÉVISION GÉNÉRALE
    { type: "Révision générale", category: "Révision générale", seuilKm: 20000, alertKmBefore: 2000 },
    { type: "Climatisation", category: "Révision générale", seuilKm: 20000, alertKmBefore: 2000 },
    { type: "Filtres", category: "Révision générale", seuilKm: 20000, alertKmBefore: 2000 },
    { type: "Vidange boîte de vitesses", category: "Révision générale", seuilKm: 60000, alertKmBefore: 5000 },

    // ---------------------------
    // CARROSSERIE
    { type: "Pare-chocs", category: "Carrosserie", seuilKm: 0 },
    { type: "Portière", category: "Carrosserie", seuilKm: 0 },
    { type: "Peinture", category: "Carrosserie", seuilKm: 0 },
    { type: "Pare-brise", category: "Carrosserie", seuilKm: 0 },
];

export default maintenanceParams;