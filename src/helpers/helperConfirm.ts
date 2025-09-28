import {ConfirmAction} from "@/types/actions";


export default  function getConfirmMessage(action: ConfirmAction): string {
    switch (action.type) {
        case "supprimer-vehicule":
            return `Voulez-vous vraiment supprimer le véhicule ${action.target.immat}?`;
        case "supprimer-email":
            return `Voulez-vous vraiment supprimer l'email ${action.target.adresse}?`;
        case "supprimer-utilisateur":
            return `Voulez-vous vraiment supprimer l'utilisateur ${action.target.name}?`;
        case "supprimer-entretien":
            return `Voulez-vous vraiment supprimer l'entretien ${action.target.type}?`;
        case "valider-vehicule":
            return `Confirmez-vous l'ajout du véhicule ${action.target.immat}?`;
        case "valider-email":
            return `Confirmez-vous l'ajout de l'email ${action.target.adresse}?`;
        case "valider-utilisateur":
            return `Confirmez-vous l'ajout de l'utilisateur ${action.target.name}?`;
        case "valider-entretien":
            return `Confirmez-vous l'ajout du paramètre ${action.target.type}?`;
        case "modifier-password":
            return "Voulez-vous changer le mot de passe admin ?";
        case "modifier-entretien":
            return `Voulez-vous vraiment modifier l'entretien ${action.target.type}?`;
        case "ajouter-conducteur":
            return `Voulez-vous vraiment ajouter ce conducteur ${action.target.nom} ${action.target.prenom}?`;
        case "supprimer-conducteur":
            return `Voulez-vous vraiment supprimer ce conducteur ${action.target.nom} ${action.target.prenom}?`;
        case "archiver":
            return "Confirmez-vous l'archivage / export des données ?";
        default:
            return "Confirmer l'action ?";
    }
}