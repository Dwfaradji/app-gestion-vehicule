"use client";

import { useMemo, useState } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import SearchBar from "@/components/ui/SearchBar";
import VehiculeTable from "@/components/vehicules/VehiculeTable";
import Totaux from "@/components/entretiens/Total";
import { useNotifications } from "@/hooks/useNotifications";
import Loader from "@/components/layout/Loader";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

export default function VehiculesPage() {
    const { vehicules } = useVehicules();
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);
    const { notifications } = useNotifications();
    const isLoading = useGlobalLoading();

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredVehicules = useMemo(() => {
        return vehicules.filter((v) => {
            const matchSearch =
                v.immat.toLowerCase().includes(search.toLowerCase()) ||
                v.modele.toLowerCase().includes(search.toLowerCase());
            const matchType = filterType ? v.type === filterType : true;
            return matchSearch && matchType;
        });
    }, [vehicules, search, filterType]);

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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Gestion des véhicules
            </h1>

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
            <Totaux
                vehicules={filteredVehicules}
            />
        </div>
    );
}