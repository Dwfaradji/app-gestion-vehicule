export interface Conducteur {
    id: number;
    nom: string;
    prenom: string;
    code: string;
    vehicules: number;
}

export interface Trajet {
    id: number;
    vehiculeId: number;
    conducteurId: number | null;
    kmDepart: number | null;
    kmArrivee: number | null;
    heureDepart?: string;
    heureArrivee?: string;
    destination?: string;
    carburant?: number;
    anomalies?: string[];
    createdAt: string;
}