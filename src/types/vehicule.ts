// Item et Depense
export interface Item {
    type: string;           // Mécanique, Carrosserie, Entretien, Dépenses
    reparations: string;    // nom de l’intervention
    date: string;           // date de réalisation
    km: number;             // km lors de l’intervention ou montant (€) pour dépense
    prestataire: string;    // qui a fait l’intervention
    note?: string;          // note optionnelle
}

export interface Depense {
    mois: string;           // ex: Janv, Fév
    carrosserie: number;    // coût entretien
    mécanique: number;      // coût carburant
    révision: number;       // coût réparations
}

export interface Vehicule {
    id: number;
    type: string;               // ex: Utilitaire, SUV, Berline
    constructeur: string;       // ex: Renault, Peugeot
    modele: string;             // ex: Kangoo, 308
    annee: number;              // ex: 2020
    energie: string;            // ex: Essence, Diesel, Électrique
    km: number;                 // kilométrage actuel
    statut: "Disponible" | "Maintenance" | "Incident";
    prixAchat?: number;         // prix d'achat (optionnel)
    dateEntretien?: string;     // date du dernier entretien
    prochaineRevision?: string; // date de la prochaine révision
    immat: string;              // immatriculation
    ctValidite: string;         // validité contrôle technique
    vim?: number;               // numéro VIN
    places?: number;            // nombre de places
    motorisation?: string;      // ex: 1.0, 1.2, Électrique
    chevauxFiscaux?: number;    // ex: 4, 5, 6
    mecanique?: Item[];         // tableau interventions mécaniques
    carrosserie?: Item[];       // tableau interventions carrosserie
    revision?: Item[];          // tableau révisions / entretien
    depenses?: Depense[];       // tableau dépenses
}