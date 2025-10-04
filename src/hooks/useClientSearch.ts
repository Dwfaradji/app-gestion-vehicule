"use client";

import { useState, useMemo } from "react";
import { Vehicule } from "@/types/vehicule";
import { Conducteur, Trajet } from "@/types/trajet";

interface UseClientSearchProps {
    vehicules: Vehicule[];
    trajets: Trajet[];
    conducteurs: Conducteur[];
}

export const useClientSearch = ({ vehicules, trajets, conducteurs }: UseClientSearchProps) => {
    // 🔍 États de recherche
    const [search, setSearch] = useState("");
    const [selectedVehicule, setSelectedVehicule] = useState<string>("");
    const [selectedConducteur, setSelectedConducteur] = useState<string>("");
    const [dateStart, setDateStart] = useState<string>("");
    const [dateEnd, setDateEnd] = useState<string>("");
    const [heureStart, setHeureStart] = useState<string>("");
    const [heureEnd, setHeureEnd] = useState<string>("");
    const [disponibleOnly, setDisponibleOnly] = useState(false);
    const [infosManquantesOnly, setInfosManquantesOnly] = useState(false);

    /** 🔄 Réinitialisation des filtres */
    const resetFilters = () => {
        setSearch("");
        setSelectedVehicule("");
        setSelectedConducteur("");
        setDateStart("");
        setDateEnd("");
        setHeureStart("");
        setHeureEnd("");
        setDisponibleOnly(false);
        setInfosManquantesOnly(false);
    };

    /** 🚗 Véhicules disponibles (aucun trajet sans heure d’arrivée) */
    const vehiculesDisponibles = useMemo(() => {
        let disponibles = vehicules.filter(
            (v) => !trajets.some((t) => t.vehiculeId === v.id && !t.heureArrivee)
        );

        // 🔧 Filtre : infos manquantes
        if (infosManquantesOnly) {
            disponibles = disponibles.filter(
                (v) => !v.immat || !v.modele || !v.type
            );
        }

        return disponibles;
    }, [vehicules, trajets, infosManquantesOnly]);

    /** 📊 Trajets filtrés */
    const filteredTrajets = useMemo(() => {
        const searchLower = search.toLowerCase();

        return trajets.filter((t) => {
            const vehicule = vehicules.find((v) => v.id === t.vehiculeId);
            const conducteur = conducteurs.find((c) => c.id === t.conducteurId);
            if (!vehicule) return false;

            // 🔧 Filtre infos manquantes : ne garder que les trajets dont le véhicule a des champs manquants
            if (infosManquantesOnly) {
                const infosManquantes =
                    !t.kmDepart ||
                    !t.kmArrivee ||
                    !t.heureDepart ||
                    !t.heureArrivee ||
                    !t.destination ||
                    !t.conducteurId;

                if (!infosManquantes) return false; // ❌ garde seulement les trajets avec infos manquantes
            }

            // 🔧 Filtre disponibilité
            if (disponibleOnly && !vehiculesDisponibles.some((v) => v.id === vehicule.id))
                return false;

            // 🔧 Filtre sélection véhicule / conducteur
            if (selectedVehicule && vehicule.id !== Number(selectedVehicule)) return false;
            if (selectedConducteur && conducteur?.id !== Number(selectedConducteur)) return false;

            // 🔧 Filtre date
            const created = new Date(t.createdAt);
            if (dateStart && created < new Date(dateStart)) return false;
            if (dateEnd && created > new Date(dateEnd)) return false;

            // 🔧 Filtre heure
            const hd = t.heureDepart ?? "00:00";
            const ha = t.heureArrivee ?? "23:59";
            if (heureStart && hd < heureStart) return false;
            if (heureEnd && ha > heureEnd) return false;

            // 🔍 Recherche texte globale
            if (
                search &&
                !(
                    vehicule.modele?.toLowerCase().includes(searchLower) ||
                    vehicule.type?.toLowerCase().includes(searchLower) ||
                    vehicule.immat?.toLowerCase().includes(searchLower) ||
                    conducteur?.prenom?.toLowerCase().includes(searchLower) ||
                    conducteur?.nom?.toLowerCase().includes(searchLower) ||
                    t.destination?.toLowerCase().includes(searchLower)
                )
            ) {
                return false;
            }

            return true;
        });
    }, [
        search,
        selectedVehicule,
        selectedConducteur,
        dateStart,
        dateEnd,
        heureStart,
        heureEnd,
        disponibleOnly,
        infosManquantesOnly,
        trajets,
        vehicules,
        conducteurs,
        vehiculesDisponibles,
    ]);

    return {
        search,
        setSearch,
        selectedVehicule,
        setSelectedVehicule,
        selectedConducteur,
        setSelectedConducteur,
        dateStart,
        setDateStart,
        dateEnd,
        setDateEnd,
        heureStart,
        setHeureStart,
        heureEnd,
        setHeureEnd,
        disponibleOnly,
        setDisponibleOnly,
        infosManquantesOnly,
        setInfosManquantesOnly,
        resetFilters,
        filteredTrajets,
        vehiculesDisponibles,
    };
};