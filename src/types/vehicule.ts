import type { Depense } from "@/types/depenses";
import type { Item } from "@/types/entretien";

export type VehiculeStatus = "Disponible" | "Maintenance" | "Incident";

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
