import { Vehicule } from "@/types/vehicule";
import { ParametreEntretien } from "@/types/entretien";
import { Utilisateur } from "@/types/utilisateur";

type Action = { actuel: string; nouveau: string };

export type ConfirmAction =
    | { type: "valider-vehicule"; target: Partial<Vehicule> }
    | { type: "supprimer-vehicule"; target: Vehicule }
    | { type: "valider-email"; target: { adresse: string } }   // ✅ simplifié
    | { type: "supprimer-email"; target: { id: number; adresse: string } }
    | { type: "valider-entretien"; target: Partial<ParametreEntretien> }
    | { type: "supprimer-entretien"; target: ParametreEntretien }
    | { type: "valider-utilisateur"; target: Utilisateur }
    | { type: "supprimer-utilisateur"; target: Utilisateur }
    | { type: "modifier-password"; target: Action }
    | { type: "modifier-entretien"; target: ParametreEntretien }
    | { type: "archiver"; target: null };