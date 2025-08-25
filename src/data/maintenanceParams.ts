export type VehicleType = "Berline" | "SUV" | "Utilitaire";

export interface MaintenanceParam {
    id: number;
    type: string;
    category: "Mécanique" | "Révision générale" | "Carrosserie";
    subCategory?: string;
    seuilKm: number;
    alertKmBefore?: number;
    description?: string;
    applicableTo?: VehicleType[];
}

export const maintenanceParams: MaintenanceParam[] = [
    // ---------------------------
    // FREINS
    { id: 1, type: "Plaquettes avant", category: "Mécanique", subCategory: "Freins", seuilKm: 60000, alertKmBefore: 5000 },
    { id: 2, type: "Plaquettes arrière", category: "Mécanique", subCategory: "Freins", seuilKm: 60000, alertKmBefore: 5000 },
    { id: 3, type: "Disques avant", category: "Mécanique", subCategory: "Freins", seuilKm: 120000, alertKmBefore: 5000 },
    { id: 4, type: "Disques arrière", category: "Mécanique", subCategory: "Freins", seuilKm: 120000, alertKmBefore: 5000 },
    { id: 5, type: "Liquide de frein", category: "Mécanique", subCategory: "Freins", seuilKm: 30000, alertKmBefore: 2000 },

    // ---------------------------
    // HUILE ET FILTRES
    { id: 6, type: "Vidange moteur", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 15000, alertKmBefore: 2000 },
    { id: 7, type: "Filtre à huile", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 15000, alertKmBefore: 2000 },
    { id: 8, type: "Filtre à air moteur", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 30000, alertKmBefore: 3000 },
    { id: 9, type: "Filtre à carburant", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 40000, alertKmBefore: 3000 },
    { id: 10, type: "Filtre habitacle", category: "Mécanique", subCategory: "Huile & Filtres", seuilKm: 20000, alertKmBefore: 2000 },

    // ---------------------------
    // COURROIES ET CHAÎNES
    { id: 11, type: "Courroie de distribution", category: "Mécanique", subCategory: "Distribution", seuilKm: 120000, alertKmBefore: 5000 },
    { id: 12, type: "Courroie accessoires", category: "Mécanique", subCategory: "Distribution", seuilKm: 60000, alertKmBefore: 5000 },
    { id: 13, type: "Chaîne de distribution", category: "Mécanique", subCategory: "Distribution", seuilKm: 150000, alertKmBefore: 5000 },

    // ---------------------------
    // TRANSMISSION / EMBRAYAGE
    { id: 14, type: "Embrayage", category: "Mécanique", subCategory: "Transmission", seuilKm: 150000, alertKmBefore: 5000 },
    { id: 15, type: "Liquide de transmission", category: "Mécanique", subCategory: "Transmission", seuilKm: 60000, alertKmBefore: 5000 },
    { id: 16, type: "Cardans / joints homocinétiques", category: "Mécanique", subCategory: "Transmission", seuilKm: 100000, alertKmBefore: 5000 },

    // ---------------------------
    // SUSPENSION / DIRECTION
    { id: 17, type: "Amortisseurs avant", category: "Mécanique", subCategory: "Suspension", seuilKm: 80000, alertKmBefore: 5000 },
    { id: 18, type: "Amortisseurs arrière", category: "Mécanique", subCategory: "Suspension", seuilKm: 80000, alertKmBefore: 5000 },
    { id: 19, type: "Rotules de direction", category: "Mécanique", subCategory: "Direction", seuilKm: 80000, alertKmBefore: 5000 },
    { id: 20, type: "Biellettes de barre stabilisatrice", category: "Mécanique", subCategory: "Direction", seuilKm: 80000, alertKmBefore: 5000 },
    { id: 21, type: "Bras de suspension", category: "Mécanique", subCategory: "Suspension", seuilKm: 100000, alertKmBefore: 5000 },

    // ---------------------------
    // ÉLECTRIQUE / ALLUMAGE
    { id: 22, type: "Bougies d’allumage", category: "Mécanique", subCategory: "Allumage", seuilKm: 40000, alertKmBefore: 2000 },
    { id: 23, type: "Batterie", category: "Mécanique", subCategory: "Électrique", seuilKm: 60000, alertKmBefore: 3000 },

    // ---------------------------
    // PNEUS ET ROUES
    { id: 24, type: "Pneus avant", category: "Mécanique", subCategory: "Pneus", seuilKm: 40000, alertKmBefore: 3000 },
    { id: 25, type: "Pneus arrière", category: "Mécanique", subCategory: "Pneus", seuilKm: 40000, alertKmBefore: 3000 },
    { id: 26, type: "Pression pneus", category: "Mécanique", subCategory: "Pneus", seuilKm: 5000, alertKmBefore: 500 },

    // ---------------------------
    // LIQUIDES DIVERS
    { id: 27, type: "Liquide de refroidissement", category: "Mécanique", subCategory: "Liquides", seuilKm: 60000, alertKmBefore: 3000 },
    { id: 28, type: "Liquide de lave-glace", category: "Mécanique", subCategory: "Liquides", seuilKm: 10000, alertKmBefore: 1000 },

    // ---------------------------
    // MOTEUR
    { id: 29, type: "Pompe à eau", category: "Mécanique", subCategory: "Moteur", seuilKm: 120000, alertKmBefore: 5000 },
    { id: 30, type: "Alternateur", category: "Mécanique", subCategory: "Moteur", seuilKm: 120000, alertKmBefore: 5000 },
    { id: 31, type: "Démarreur", category: "Mécanique", subCategory: "Moteur", seuilKm: 150000, alertKmBefore: 5000 },
    { id: 32, type: "Injecteurs", category: "Mécanique", subCategory: "Moteur", seuilKm: 100000, alertKmBefore: 5000 },
    { id: 33, type: "Turbocompresseur", category: "Mécanique", subCategory: "Moteur", seuilKm: 200000, alertKmBefore: 10000 },
    { id: 34, type: "Soupapes et culasse", category: "Mécanique", subCategory: "Moteur", seuilKm: 150000, alertKmBefore: 5000 },

    // ---------------------------
    // RÉVISION GÉNÉRALE
    { id: 35, type: "Révision générale", category: "Révision générale", seuilKm: 20000, alertKmBefore: 2000 },
    { id: 36, type: "Climatisation", category: "Révision générale", seuilKm: 20000, alertKmBefore: 2000 },
    { id: 37, type: "Filtres", category: "Révision générale", seuilKm: 20000, alertKmBefore: 2000 },
    { id: 38, type: "Vidange boîte de vitesses", category: "Révision générale", seuilKm: 60000, alertKmBefore: 5000 },

    // ---------------------------
    // CARROSSERIE
    { id: 39, type: "Pare-chocs", category: "Carrosserie", seuilKm: 0 },
    { id: 40, type: "Portière", category: "Carrosserie", seuilKm: 0 },
    { id: 41, type: "Peinture", category: "Carrosserie", seuilKm: 0 },
    { id: 42, type: "Pare-brise", category: "Carrosserie", seuilKm: 0 },
];

export default maintenanceParams;