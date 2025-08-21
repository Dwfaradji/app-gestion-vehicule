// types/entretien.ts
export interface ParametreEntretien {
    type: string;
    seuilKm: number; // Intervalle avant prochaine alerte
    dernierKm?: number; // km au dernier entretien
}

export interface Notification {
    type: "CT" | "Entretien" | "Mécanique" | "Carrosserie";
    message: string;
    vehicleId: number;
    date?: string;       // pour les alertes liées aux dates
    km?: number;         // pour les alertes liées au kilométrage
    seen?: boolean;      // pour gérer les notifications lues/non lues
}

interface Maintenance {
    id: number;
    type: string;
    date: string;
    statut: "Prévu" | "En cours" | "Terminé";
}


export interface Item {
    categorie: string;           // Mécanique, Carrosserie, Entretien, Dépenses
    reparations: string;    // nom de l’intervention
    date: string;           // date de réalisation
    km: number;             // km lors de l’intervention ou montant (€) pour dépense
    prestataire: string;    // qui a fait l’intervention
    note?: string;          // note optionnelle
}
