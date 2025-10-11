import type { Depense } from "@/types/depenses";
import type { Item } from "@/types/entretien";

export type VehiculeStatus = "Disponible" | "Maintenance" | "Incident";

//
// export interface Vehicule {
//     id: number;
//     type: string;               // ex: Utilitaire, SUV, Berline
//     constructeur: string;       // ex: Renault, Peugeot
//     modele: string;             // ex: Kangoo, 308
//     annee: number;              // ex: 2020
//     energie: string;            // ex: Essence, Diesel, Électrique
//     km: number;                 // kilométrage actuel
//     statut: VehiculeStatus | string | null;
//     prixAchat?: number | null;         // prix d'achat (optionnel)
//     dateEntretien: string;     // date du dernier entretien
//     prochaineRevision: string; // date de la prochaine révision
//     immat: string;              // immatriculation
//     ctValidite: string;         // validité contrôle technique
//     vim?: string;               // numéro VIN
//     places?: number;            // nombre de places
//     motorisation?: string;      // ex: 1.0, 1.2, Électrique
//     chevauxFiscaux?: number;    // ex: 4, 5, 6
//     mecanique?: Item[];         // tableau interventions mécaniques
//     carrosserie?: Item[];       // tableau interventions carrosserie
//     revision?: Item[];          // tableau révisions / entretien
//     depense?: Depense[];       // tableau dépenses
// }

export interface Vehicule {
  id: number;
  type: string;
  constructeur: string;
  modele: string;
  annee: number;
  energie: string;
  km: number;
  statut: VehiculeStatus | null;
  prixAchat?: number | null;
  dateEntretien: string | Date;
  prochaineRevision: string | Date;
  immat: string;
  ctValidite: string | Date;
  vim?: string;
  places?: number;
  motorisation?: string;
  chevauxFiscaux?: number;
  mecanique?: Item[];
  carrosserie?: Item[];
  revision?: Item[];
  depense?: Array<
    Depense & { date: string | Date; createdAt: string | Date; updatedAt: string | Date }
  >;
}
