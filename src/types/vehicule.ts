import {Depense} from "@/types/depenses";
import {Item} from "@/types/entretien";



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
    dateEntretien: string;     // date du dernier entretien
    prochaineRevision: string; // date de la prochaine révision
    immat: string;              // immatriculation
    ctValidite: string;         // validité contrôle technique
    vim?: number;               // numéro VIN
    places?: number;            // nombre de places
    motorisation?: string;      // ex: 1.0, 1.2, Électrique
    chevauxFiscaux?: number;    // ex: 4, 5, 6
    mecanique?: Item[];         // tableau interventions mécaniques
    carrosserie?: Item[];       // tableau interventions carrosserie
    revision?: Item[];          // tableau révisions / entretien
    depense?: Depense[];       // tableau dépenses
}