"use client";

import { useVehicules } from "@/context/vehiculesContext";
import { useTrajets } from "@/context/trajetsContext";
import { useState } from "react";
import ActionBar from "@/components/Accueil/ActionBar";
import AttribuerVehiculeModal from "@/components/Accueil/AttribuerVehiculeModal";
import VehiculesTableAccueil from "@/components/Accueil/VehiculesTableAccueil";
import {Trajet} from "@/types/trajet";

const AccueilPage = () => {
    const { vehicules, updateVehicule } = useVehicules();
    const { trajets, conducteurs, addTrajet, refreshAll } = useTrajets();

    const [loadingVehiculeId, setLoadingVehiculeId] = useState<number | null>(null);
    const [attribuerOpen, setAttribuerOpen] = useState(false);



    const handleRefresh = async () => await refreshAll();


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
    const handleAddTrajet = async (t: Trajet) => {
        await addTrajet(t);
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
                    addTrajet={handleAddTrajet}
                />
            )}

            <VehiculesTableAccueil
                vehicules={vehicules}
                trajets={trajets}
                conducteurs={conducteurs}
                calculerDuree={calculerDuree}
                handleUpdateKmVehicule={handleUpdateKmVehicule}
                loadingVehiculeId={loadingVehiculeId}
            />
        </div>
    );
};

export default AccueilPage;