"use client";

import { useState, useCallback } from "react";
import { useVehicules } from "@/context/vehiculesContext";

interface UpdateVehiculeParams {
    km?: number;
    prochaineRevision?: string;
    dateEntretien?: string;
    ctValidite?: string;
    [key: string]: any;
}

export const useVehiculeUpdater = () => {
    const { updateVehicule } = useVehicules();
    const [loading, setLoading] = useState(false);

    /**
     * Met à jour un véhicule de manière sécurisée et gère le loading
     * @param vehiculeId Id du véhicule à mettre à jour
     * @param params Données à mettre à jour
     */
    const updateVehiculeSafe = useCallback(
        async (vehiculeId: number, params: UpdateVehiculeParams) => {
            setLoading(true);
            try {
                await updateVehicule({ id: vehiculeId, ...params });
            } catch (err) {
                console.error("Erreur mise à jour véhicule:", err);
            } finally {
                setLoading(false);
            }
        },
        [updateVehicule]
    );

    /**
     * Valide le CT d’un véhicule
     * @param vehiculeId Id du véhicule
     * @param contreVisite Si c’est une contre-visite (prolonge moins longtemps)
     */
    const validerCT = useCallback(
        async (vehiculeId: number, contreVisite = false) => {
            setLoading(true);
            try {
                const newDate = new Date();
                newDate.setFullYear(newDate.getFullYear() + 1);
                if (contreVisite) newDate.setMonth(newDate.getMonth() + 3);

                await updateVehicule({ id: vehiculeId, ctValidite: newDate.toISOString() });
                return newDate.toISOString();
            } catch (err) {
                console.error("Erreur validation CT:", err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [updateVehicule]
    );


    return { updateVehiculeSafe, validerCT, loading };
};