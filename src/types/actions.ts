import {Vehicule} from "@/types/vehicule";
import {Email, ParametreEntretien} from "@/types/entretien";
import {Utilisateur} from "@/types/utilisateur";

export type ConfirmAction =
    | { type: "valider-vehicule"; target: Partial<Vehicule> }
    | { type: "supprimer-vehicule"; target: Vehicule }
    | { type: "valider-email"; target: Email }
    | { type: "supprimer-email"; target: Email }
    | { type: "valider-entretien"; target: ParametreEntretien }
    | { type: "supprimer-entretien"; target: ParametreEntretien }
    | { type: "valider-utilisateur"; target: Utilisateur }
    | { type: "supprimer-utilisateur"; target: Utilisateur }
    | { type: "modifier-password"; target: Utilisateur }
    | { type: "modifier-entretien"; target: ParametreEntretien }
    | { type: "archiver"; target: null };