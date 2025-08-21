

// ----- Totaux -----
import {Vehicule} from "@/types/vehicule";

interface TotauxProps {
    vehicules: Vehicule[];
}
const Totaux = ({ vehicules }: TotauxProps) => {
    const totalMaintenance = vehicules.filter(v => v.statut === "Maintenance").length;
    const totalIncident = vehicules.filter(v => v.statut === "Incident").length;
    return (
        <div className="mt-4 text-sm text-gray-600">
            <p>Total véhicules : <strong>{vehicules.length}</strong></p>
            <p>En maintenance : <strong>{totalMaintenance}</strong></p>
            <p>Incident : <strong>{totalIncident}</strong></p>
        </div>
    );
};

export default Totaux;