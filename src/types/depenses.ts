export interface Depense {
    id: number;               // identifiant unique
    vehiculeId: number;       // FK vers le véhicule
    categorie: string// type de dépense
    reparation: string;
    montant: number;          // coût en €
    description?: string;     // détail (optionnel)
    date: string;             // au format ISO (YYYY-MM-DD)
    createdAt: string;        // date création
    updatedAt: string;        // date mise à jour
    prestataire: string;
    km: number;
    note?: string;

}