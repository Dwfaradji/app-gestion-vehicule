// types/entretien.ts
export interface ParametreEntretien {
    id: number;
    type: string;        // ex: "Freins", "Vidange", "Révision générale"
    seuilKm: number;     // kilométrage entre interventions
    dernierKm?: number;  // dernier km où la pièce a été remplacée
    immat?: string;      // si spécifique à un véhicule
}

export interface Notification {
    id: number;
    type: "CT" |"Contre Visite" | "Entretien" | "Mécanique" | "Carrosserie";
    message: string;
    vehicleId: number;
    date?: string;       // pour les alertes liées aux dates
    km?: number;         // pour les alertes liées au kilométrage
    seen?: boolean;
    priority:  "urgent" | "moyen" | "normal"// pour gérer les notifications lues/non lues
}


interface Maintenance {
    id: number;
    type: string;
    date: string;
    statut: "Prévu" | "En cours" | "Terminé";
}

// types email
export interface Email {
    id: number;
    date: string;
    status: "PENDING" | "SENT" | "FAILED";
    from: string;
    to: string;
    subject: string;
    body: string;
}

export interface Item {
    montant: number;
    categorie: string;           // Mécanique, Carrosserie, Entretien, Dépenses
    reparations: string;    // nom de l’intervention
    date: string;           // date de réalisation
    km: number;             // km lors de l’intervention ou montant (€) pour dépense
    prestataire: string;    // qui a fait l’intervention
    note?: string;          // note optionnelle
}
