// types/entretien.ts
export interface ParametreEntretien {
    id: number;
    type: string;        // ex: "Freins", "Vidange", "Révision générale"
    seuilKm: number;
    alertKmBefore: number// kilométrage entre interventions
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

// types email
export interface Email {
    adresse: "string";
    id: number;
    date: string;
    status: "PENDING" | "SENT" | "FAILED";
    from: string;
    to: string;
    subject: string;
    body: string;
}

export interface Item {
    id?: number;
    montant: number;
    categorie: string;           // Mécanique, Carrosserie, Entretien, Dépenses
    reparation: string;    // nom de l’intervention
    date: string;           // date de réalisation
    km: number;             // km lors de l’intervention ou montant (€) pour dépense
    intervenant: string;    // qui a fait l’intervention
    note?: string;          // note optionnelle
}
