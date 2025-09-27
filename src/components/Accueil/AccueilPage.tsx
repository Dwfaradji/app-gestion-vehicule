"use client";

import { useRouter } from "next/navigation";
import { useVehicules } from "@/context/vehiculesContext";
import { useTrajets, Trajet } from "@/context/trajetsContext";
import { useState, useMemo } from "react";
import ActionBar from "@/components/Accueil/ActionBar";
import AttribuerVehiculeModal from "@/components/Accueil/AttribuerVehiculeModal";
import VehiculesTableAccueil from "@/components/Accueil/VehiculesTableAccueil";

const AccueilPage = () => {
    const router = useRouter();
    const { vehicules, updateVehicule } = useVehicules();
    const { trajets, conducteurs, addTrajet, refreshAll } = useTrajets();

    const [loadingVehiculeId, setLoadingVehiculeId] = useState<number | null>(null);
    const [attribuerOpen, setAttribuerOpen] = useState(false);

    const [selectedVehicule, setSelectedVehicule] = useState<number | null>(null);
    const [selectedConducteur, setSelectedConducteur] = useState<number | null>(null);
    const [step, setStep] = useState(1);

    const maintenant = useMemo(() => new Date(), []);

    const handleRefresh = async () => await refreshAll();

    const getEtatVehicule = (vehiculeId: number) => {
        const trajet = trajets.find(t => t.vehiculeId === vehiculeId);
        if (!trajet || !trajet.conducteurId)
            return { label: "Aucun conducteur", icon: <span className="text-red-600">✖</span> };
        const infosManquantes = !trajet.kmDepart || !trajet.kmArrivee || !trajet.heureDepart || !trajet.heureArrivee || !trajet.destination;
        if (infosManquantes) return { label: "Infos manquantes", icon: <span className="text-yellow-600">⚠</span> };
        return { label: "Complet", icon: <span className="text-green-600">✔</span> };
    };

    const calculerDuree = (heureDepart?: string, heureArrivee?: string) => {
        if (!heureDepart || !heureArrivee) return null;
        const [hdH, hdM] = heureDepart.split(":").map(Number);
        const [haH, haM] = heureArrivee.split(":").map(Number);
        let diff = haH * 60 + haM - (hdH * 60 + hdM);
        if (diff < 0) diff += 24 * 60;
        return `${Math.floor(diff / 60)}h ${String(diff % 60).padStart(2, "0")}m`;
    };

    const handleUpdateKmVehicule = async (vehiculeId: number, kmArrivee?: number) => {
        if (!kmArrivee) return;
        setLoadingVehiculeId(vehiculeId);
        try { await updateVehicule({ id: vehiculeId, km: kmArrivee }); }
        catch (err) { console.error(err); }
        finally { setLoadingVehiculeId(null); }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ActionBar
                setAttribuerOpen={setAttribuerOpen}
                handleRefresh={handleRefresh}
            />

            {attribuerOpen && (
                <AttribuerVehiculeModal
                    vehicules={vehicules}
                    conducteurs={conducteurs}
                    trajets={trajets}
                    setAttribuerOpen={setAttribuerOpen}
                    selectedVehicule={selectedVehicule}
                    setSelectedVehicule={setSelectedVehicule}
                    selectedConducteur={selectedConducteur}
                    setSelectedConducteur={setSelectedConducteur}
                    step={step}
                    setStep={setStep}
                    addTrajet={addTrajet}
                />
            )}

            <VehiculesTableAccueil
                vehicules={vehicules}
                trajets={trajets}
                conducteurs={conducteurs}
                router={router}
                getEtatVehicule={getEtatVehicule}
                calculerDuree={calculerDuree}
                handleUpdateKmVehicule={handleUpdateKmVehicule}
                loadingVehiculeId={loadingVehiculeId}
            />
        </div>
    );
};

export default AccueilPage;