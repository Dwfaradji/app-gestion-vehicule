// ============================
// 📦 Entreprise & Relations
// ============================
export interface Horaire {
  id: number | null;
  ouverture: string; // format HH:mm
  fermeture: string; // format HH:mm
  entrepriseId?: number | null;
  sectionId?: number | null;
}

export interface Vacances {
  id: number;
  entrepriseId?: number | null;
  sectionId?: number | null;
  debut: string; // ISO string (Date)
  fin: string; // ISO string (Date)
  description?: string | null;
}

export interface Section {
  id: number;
  entrepriseId: number;
  nom: string;
  adresse?: string | null;
  ville?: string | null;
  codePostal?: string | null;
  pays?: string | null;
  email?: string | null;
  telephone?: string | null;
  createdAt: string;
  updatedAt: string;
  horaireId?: number | null;
  horaire?: Horaire | null;
  vacances?: Vacances[];
}

export interface Entreprise {
  id: number;
  nom: string;
  adresse?: string | null;
  ville?: string | null;
  codePostal?: string | null;
  pays?: string | null;
  email?: string | null;
  telephone?: string | null;
  siret?: string | null;
  createdAt?: string;
  updatedAt?: string;
  horaireId?: number | null;
  horaire?: Horaire | null;
  sections?: Section[];
  vacances?: Vacances[];
}

// ============================
// 📋 Types d’entrée pour les formulaires ou API
// ============================

export interface HoraireInput {
  ouverture: string;
  fermeture: string;
}

export interface EntrepriseInput {
  nom: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  email?: string;
  telephone?: string;
  siret?: string;
  horaire?: HoraireInput;
}

export interface SectionInput {
  nom: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  email?: string;
  telephone?: string;
  horaire?: HoraireInput;
}

export interface VacancesInput {
  debut: string; // ISO string
  fin: string; // ISO string
  description?: string;
}
