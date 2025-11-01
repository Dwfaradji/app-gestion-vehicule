import type { Vehicule } from "@/types/vehicule";
import type { ParametreEntretien } from "@/types/entretien";
import type { Utilisateur } from "@/types/utilisateur";

type Conducteur = { id?: number; nom: string; prenom: string };

export type ConfirmAction =
  | { type: "valider-vehicule"; target: Partial<Vehicule> }
  | { type: "supprimer-vehicule"; target: Vehicule }
  | { type: "valider-email"; target: { adresse: string } }
  | { type: "supprimer-email"; target: { adresse: string } }
  | { type: "valider-entretien"; target: Partial<ParametreEntretien> }
  | { type: "supprimer-entretien"; target: ParametreEntretien }
  | { type: "valider-utilisateur"; target: Utilisateur }
  | { type: "supprimer-utilisateur"; target: Utilisateur }
  | { type: "modifier-password" }
  | { type: "modifier-entretien"; target: ParametreEntretien }
  | { type: "archiver"; target: null }
  | { type: "ajouter-conducteur"; target: Partial<Conducteur> }
  | { type: "supprimer-conducteur"; target: Conducteur }
  | { type: "reinitialiser-entretien" }
  | { type: "rejeter-utilisateur"; target: Utilisateur };
