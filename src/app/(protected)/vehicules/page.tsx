"use client";

import { useMemo, useState } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import SearchBar from "@/components/ui/SearchBar";
import VehiculeTable from "@/components/vehicules/VehiculeTable";
import Totaux from "@/components/entretiens/Total";
import { useNotifications } from "@/hooks/useNotifications";
import Loader from "@/components/layout/Loader";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import {AlertCircle, CheckCircle, Clock, ShieldAlert, Truck, Wrench} from "lucide-react";
import useStats from "@/hooks/useStats";
import {Vehicule} from "@/types/vehicule";

export default function VehiculesPage() {
    const { vehicules } = useVehicules();
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);
    const { notifications } = useNotifications();
    const isLoading = useGlobalLoading();

    const filteredVehicules = useMemo(() => {
        return vehicules.filter((v) => {
            const matchSearch =
                v.immat.toLowerCase().includes(search.toLowerCase()) ||
                v.modele.toLowerCase().includes(search.toLowerCase());
            const matchType = filterType ? v.type === filterType : true;
            return matchSearch && matchType;
        });
    }, [vehicules, search, filterType]);

    const statsVehicules = useStats<Vehicule>({
        data: vehicules,
        metrics: [
            {
                label: "CT expiré",
                value: (v) => v.filter((veh) => veh.ctValidite && new Date(veh.ctValidite) < new Date()).length,
                color: "orange",
                icon: ShieldAlert,
            },
            {
                label: "Révision à refaire",
                value: (v) => v.filter((veh) => veh.prochaineRevision && new Date(veh.prochaineRevision) < new Date()).length,
                color: "purple",
                icon: Clock,
            },
            {
                label: "Incident",
                value: (v) => v.filter((veh) => veh.statut === "Incident").length,
                color: "red",
                icon: AlertCircle,
            },
            {
                label: "En maintenance",
                value: (v) => v.filter((veh) => veh.statut === "Maintenance").length,
                color: "yellow",
                icon: Wrench,
            },
            {
                label: "Disponible",
                value: (v) => v.filter((veh) => veh.statut === "Disponible").length,
                color: "green",
                icon: CheckCircle,
            },
            {
                label: "Total véhicules",
                value: (v) => v.length,
                color: "blue",
                icon: Truck,
            },
        ],
    });

    if (isLoading) {
        return (
            <Loader
                message="Chargement des véhicules ..."
                isLoading={isLoading}
                skeleton="none"
                fullscreen
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-32">
            {/* --- Titre --- */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestion des véhicules</h1>

            {/* --- Barre de recherche et filtres --- */}
            <SearchBar
                search={search}
                setSearch={setSearch}
                filterType={filterType}
                setFilterType={setFilterType}
                vehicules={filteredVehicules}
            />

            {/* --- Tableau des véhicules --- */}
            <div className="mb-6">
                <VehiculeTable vehicules={filteredVehicules} notifications={notifications} />
            </div>

            {/* --- Totaux fixé en bas --- */}
            <Totaux stats={statsVehicules}
                    openLabel="Afficher les totaux véhicules"
                    closeLabel="Réduire le tableau de bord" />
        </div>
    );
}