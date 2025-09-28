'use client';

import { useParams } from 'next/navigation';
import FormulaireTrajet from '@/components/Accueil/FormulaireTrajet';
import { useTrajets } from "@/context/trajetsContext";
import { useVehicules } from "@/context/vehiculesContext";

const Page = () => {
    const { id: vehiculeIdParam } = useParams<{ id: string }>();
    const vehiculeId = vehiculeIdParam ? Number(vehiculeIdParam) : null;

    const { conducteurs, trajets } = useTrajets();
    const { vehicules, updateVehicule } = useVehicules();

    if (!vehiculeId) return <p>Véhicule introuvable</p>;

    const vehicule = vehicules.find((v) => v.id === vehiculeId);
    if (!vehicule) return <p>Véhicule introuvable</p>;

    const trajetExistant = trajets.find(t => t.vehiculeId === vehiculeId);
    if (!trajetExistant) return <p>Aucun trajet existant</p>;

    // Le conducteur n'est valide que si le trajet n'est pas terminé
    const conducteur = (!trajetExistant.kmArrivee && !trajetExistant.heureArrivee)
        ? conducteurs.find(c => c.id === trajetExistant.conducteurId)
        : undefined;

    /** 🔹 Mise à jour automatique du carburant du véhicule */
    const handleTrajetUpdated = async () => {
        try {
            await updateVehicule({ id: vehicule.id, km: trajetExistant.kmArrivee ?? vehicule.km});
        } catch (err) {
            console.error("Erreur lors de la mise à jour du véhicule :", err);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <FormulaireTrajet
                vehicule={vehicule}
                conducteur={conducteur}
                trajetId={trajetExistant.id}
                maxAttempts={5}
                onTrajetUpdated={handleTrajetUpdated} // 🔹
            />
        </div>
    );
};

export default Page;