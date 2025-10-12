"use client";

import { useState, useMemo } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import { useTrajets } from "@/context/trajetsContext";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

import ActionBar from "@/components/Accueil/ActionBar";
import AttribuerVehiculeModal from "@/components/Accueil/AttribuerVehiculeModal";
import VehiculesTableTrajet from "@/components/Accueil/VehiculesTableTrajet";
import Totaux from "@/components/entretiens/Total";
import Loader from "@/components/layout/Loader";

import type { Trajet } from "@/types/trajet";
import useStats from "@/hooks/useStats";
import {AlertCircle, CheckCircle, Clock, Droplet, MapPin, Truck} from "lucide-react";

const AccueilPage = () => {
    const { vehicules, updateVehicule } = useVehicules();
    const { trajets, conducteurs, addTrajet } = useTrajets();
    const isLoading = useGlobalLoading();

    const [loadingVehiculeId, setLoadingVehiculeId] = useState<number | null>(null);
    const [attribuerOpen, setAttribuerOpen] = useState(false);

    // Filtrer uniquement les trajets valides
    const filteredTrajets = useMemo(
        () => trajets.filter((t) => t.conducteurId && t.vehiculeId),
        [trajets]
    );

    // Calcule la durée d’un trajet
    const calculerDuree = (heureDepart?: string, heureArrivee?: string) => {
        if (!heureDepart || !heureArrivee) return null;
        const [hdH, hdM] = heureDepart.split(":").map(Number);
        const [haH, haM] = heureArrivee.split(":").map(Number);
        let diff = haH * 60 + haM - (hdH * 60 + hdM);
        if (diff < 0) diff += 24 * 60;
        return `${Math.floor(diff / 60)}h ${String(diff % 60).padStart(2, "0")}m`;
    };

    // Met à jour le kilométrage du véhicule
    const handleUpdateKmVehicule = async (vehiculeId: number, kmArrivee?: number) => {
        if (!kmArrivee) return;
        setLoadingVehiculeId(vehiculeId);
        try {
            await updateVehicule({ id: vehiculeId, km: kmArrivee });
        } finally {
            setLoadingVehiculeId(null);
        }
    };

    // Ajoute un nouveau trajet
    const handleAddTrajet = async (t: Trajet) => {
        await addTrajet(t);
    };

    // Calcul des statistiques
    const statsTrajets = useStats<Trajet>({
        data: trajets,
        metrics: [
            // Trajets effectués (complets)
            {
                label: "Trajets effectués",
                value: (t) => t.filter(tr => tr.kmDepart != null && tr.kmArrivee != null && tr.heureDepart && tr.heureArrivee && tr.destination).length,
                color: "blue",
                icon: MapPin,
            },
            // Trajets en cours
            {
                label: "Trajets en cours",
                value: (t) =>
                    t.filter(
                        (tr) =>
                            tr.kmDepart == null ||
                            tr.kmArrivee == null ||
                            !tr.heureDepart ||
                            !tr.heureArrivee
                    ).length,
                color: "indigo",
                icon: Truck,
            },
            // Nombre de conducteurs affectés
            {
                label: "Conducteurs affectés",
                value: (t) => {
                    // IDs des conducteurs sur des trajets en cours
                    const conducteursAttribues = new Set(
                        t
                            .filter(tr => tr.kmDepart == null || tr.kmArrivee == null || !tr.heureDepart || !tr.heureArrivee)
                            .map(tr => tr.conducteurId)
                            .filter(Boolean)
                    );
                    return conducteursAttribues.size;
                },
                color: "indigo",
                icon: CheckCircle,
            },
            {
                label: "Véhicules disponibles",
                value: (t) => {
                    // IDs des véhicules utilisés sur des trajets en cours
                    const vehiculesAttribues = new Set(
                        t
                            .filter(tr => tr.kmDepart == null || tr.kmArrivee == null || !tr.heureDepart || !tr.heureArrivee)
                            .map(tr => tr.vehiculeId)
                            .filter(Boolean)
                    );
                    return vehicules.length - vehiculesAttribues.size;
                },
                color: "green",
                icon: Truck,
            },
            // Trajets avec infos manquantes
            {
                label: "Infos manquantes",
                value: (t) => t.filter(tr => !tr.kmDepart || !tr.kmArrivee || !tr.heureDepart || !tr.heureArrivee || !tr.destination).length,
                color: "red",
                icon: AlertCircle,
            },
        ],
    });

    // Loader initial uniquement si les données ne sont pas encore chargées
    if (isLoading && trajets.length === 0 && vehicules.length === 0) {
        return (
            <Loader
                message="Chargement des trajets en cours..."
                isLoading={isLoading}
                fullscreen
            />
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header + actions */}
            <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-800 flex-1">Gestion des trajets</h1>
                <ActionBar setAttribuerOpen={setAttribuerOpen} filteredCount={filteredTrajets.length} />
            </div>

            {/* Modale d’attribution */}
            {attribuerOpen && (
                <AttribuerVehiculeModal
                    vehicules={vehicules}
                    conducteurs={conducteurs}
                    trajets={trajets}
                    setAttribuerOpen={setAttribuerOpen}
                    addTrajet={handleAddTrajet}
                />
            )}

            {/* Table des trajets */}
            <VehiculesTableTrajet
                vehicules={vehicules}
                trajets={trajets}
                conducteurs={conducteurs}
                calculerDuree={calculerDuree}
                handleUpdateKmVehicule={handleUpdateKmVehicule}
                loadingVehiculeId={loadingVehiculeId}
            />

            {/* Totaux et statistiques */}
            <Totaux stats={statsTrajets} openLabel = "Afficher les stats trajet" closeLabel = "Réduire le tableau de bord"/>
        </div>
    );
};

export default AccueilPage;