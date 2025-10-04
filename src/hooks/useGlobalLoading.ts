import { useVehicules } from "@/context/vehiculesContext";
import { useUtilisateurs } from "@/context/utilisateursContext";
import { useParametresEntretien } from "@/context/parametresEntretienContext";
import { useTrajets } from "@/context/trajetsContext";
import { useEmails } from "@/context/emailsContext";

export const useGlobalLoading = () => {
    const { loading: vehiculesLoading } = useVehicules();
    const { loading: utilisateursLoading } = useUtilisateurs();
    const { loading: entretienLoading } = useParametresEntretien();
    const { loading: conducteursLoading } = useTrajets();
    const { loading: emailsLoading } = useEmails();

    return vehiculesLoading || utilisateursLoading || entretienLoading || conducteursLoading || emailsLoading;
};