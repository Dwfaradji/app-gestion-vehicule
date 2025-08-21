import StatutBadge from "@/components/StatutBadge";
import {Vehicule} from "@/types/vehicule";


const CarteInfosVehicule = ({ vehicule }: { vehicule: Vehicule }) => (
    <div className="flex-1 rounded-xl bg-white shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-2">Infos véhicule</h2>
        <p><strong>Immat :</strong> {vehicule.immat}</p>
        <p><strong>Modèle :</strong> {vehicule.modele}</p>
        <p><strong>Kilométrage :</strong> {vehicule.km} km</p>
        <p><strong>Statut :</strong> <StatutBadge statut={vehicule.statut} /></p>
            <p><strong>Révision :</strong>{vehicule.prochaineRevision} </p>
    </div>
);

export default CarteInfosVehicule;