import { toast } from "sonner";
import type { ConfirmAction } from "@/types/actions";
import type { Vehicule } from "@/types/vehicule";
import type { ParametreEntretien } from "@/types/entretien";
import type { Utilisateur } from "@/types/utilisateur";
import type { Conducteur } from "@/types/trajet";

/**
 * Toutes les actions possibles gérées par le handleConfirmAction
 */
export type ConfirmActionType =
  | "valider-vehicule"
  | "supprimer-vehicule"
  | "valider-email"
  | "supprimer-email"
  | "valider-entretien"
  | "modifier-entretien"
  | "supprimer-entretien"
  | "valider-utilisateur"
  | "supprimer-utilisateur"
  | "ajouter-conducteur"
  | "supprimer-conducteur"
  | "modifier-password";

/**
 * Interface des fonctions disponibles pour exécuter les actions confirmées
 */
export interface ConfirmActionHandlers {
  addVehicule: (vehicule: Partial<Vehicule>) => Promise<Vehicule | null> | Vehicule | null;
  deleteVehicule: (id: number) => Promise<boolean> | boolean;
  addEmail: (adresse: string) => Promise<void> | void;
  deleteEmail: (id: number) => Promise<void> | void;
  addParametreEntretien: (param: Partial<ParametreEntretien>) => Promise<void> | void;
  updateParametreEntretien: (param: Partial<ParametreEntretien>) => Promise<void> | void;
  deleteParametreEntretien: (id: number) => Promise<void> | void;
  addUtilisateur: (user: Partial<Utilisateur>) => Promise<void> | void;
  deleteUtilisateur: (id: number) => Promise<void> | void;
  addConducteur: (conducteur: Partial<Conducteur>) => Promise<void> | void;
  deleteConducteur: (id: number) => Promise<void> | void;
  updatePassword?: (data: { id: number; actuel: string; nouveau: string }) => Promise<void> | void;
  currentUserId?: number;
  setConfirmAction: (action: ConfirmAction | null) => void;
}

/**
 * Exécute une action confirmée globalement dans l’application
 */
export async function handleConfirmAction(
  confirmAction: ConfirmAction | null,
  handlers: ConfirmActionHandlers,
): Promise<void> {
  if (!confirmAction) return;

  const { type, target } = confirmAction;
  const {
    addVehicule,
    deleteVehicule,
    addEmail,
    deleteEmail,
    addParametreEntretien,
    updateParametreEntretien,
    deleteParametreEntretien,
    addUtilisateur,
    deleteUtilisateur,
    addConducteur,
    deleteConducteur,
    updatePassword,
    currentUserId,
    setConfirmAction,
  } = handlers;

  try {
    switch (type as ConfirmActionType) {
      // ---------------- Véhicules ----------------
      case "valider-vehicule":
        await addVehicule(target as Partial<Vehicule>);
        toast.success("Véhicule ajouté avec succès");
        break;

      case "supprimer-vehicule":
        await deleteVehicule((target as Vehicule).id);
        toast.success("Véhicule supprimé");
        break;

      // ---------------- Emails ----------------
      case "valider-email":
        await addEmail((target as { adresse: string }).adresse);
        toast.success("Email ajouté");
        break;

      case "supprimer-email":
        await deleteEmail((target as { id: number }).id);
        toast.success("Email supprimé");
        break;

      // ---------------- Paramètres d’entretien ----------------
      case "valider-entretien":
        await addParametreEntretien(target as Partial<ParametreEntretien>);
        toast.success("Paramètre d’entretien ajouté");
        break;

      case "modifier-entretien":
        await updateParametreEntretien(target as Partial<ParametreEntretien>);
        toast.success("Paramètre d’entretien mis à jour");
        break;

      case "supprimer-entretien":
        await deleteParametreEntretien((target as { id: number }).id);
        toast.success("Paramètre d’entretien supprimé");
        break;

      // ---------------- Utilisateurs ----------------
      case "valider-utilisateur":
        await addUtilisateur(target as Partial<Utilisateur>);
        toast.success("Utilisateur ajouté");
        break;

      case "supprimer-utilisateur":
        await deleteUtilisateur((target as Utilisateur).id);
        toast.success("Utilisateur supprimé");
        break;

      // ---------------- Conducteurs ----------------
      case "ajouter-conducteur":
        await addConducteur(target as Partial<Conducteur>);
        toast.success("Conducteur ajouté");
        break;

      case "supprimer-conducteur":
        await deleteConducteur((target as Conducteur).id);
        toast.success("Conducteur supprimé");
        break;

      // ---------------- Mot de passe ----------------
      case "modifier-password": {
        if (!currentUserId) {
          toast.error("Aucun utilisateur connecté");
          return;
        }
        if (!updatePassword) {
          toast.error("updatePassword non défini");
          return;
        }
        const { actuel, nouveau } = target as { actuel: string; nouveau: string };
        await updatePassword({ id: currentUserId, actuel, nouveau });
        toast.success("Mot de passe mis à jour");
        break;
      }

      default:
        toast.error("Type d’action non reconnu");
        console.warn("Action inconnue :", type);
        break;
    }
  } catch (error) {
    console.error("Erreur handleConfirmAction:", error);
    toast.error("Une erreur est survenue pendant l’action");
  } finally {
    setConfirmAction(null);
  }
}
