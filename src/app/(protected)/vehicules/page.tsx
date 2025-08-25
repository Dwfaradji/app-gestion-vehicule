"use client";
import { useMemo, useState, useEffect } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import { useNotifications } from "@/context/notificationsContext";
import SearchBar from "@/components/ui/SearchBar";
import VehiculeTable from "@/components/vehicules/VehiculeTable";
import Totaux from "@/components/entretiens/Total";
import Link from "next/link";
import maintenanceParams from "@/data/maintenanceParams";

export default function VehiculesPage() {
    const { vehicules } = useVehicules();
    const { notifications, refreshNotifications } = useNotifications();
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);

    const parametres = maintenanceParams


    useEffect(() => {
        refreshNotifications(vehicules, parametres);
    }, [vehicules, parametres, refreshNotifications]);

    const filteredVehicules = useMemo(() => {
        return vehicules.filter((v) => {
            const matchSearch =
                v.immat.toLowerCase().includes(search.toLowerCase()) ||
                v.modele.toLowerCase().includes(search.toLowerCase())
            const matchType = filterType ? v.type === filterType : true;
            return matchSearch && matchType;
        });
    }, [vehicules, search, filterType]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des véhicules</h1>
            <SearchBar search={search} setSearch={setSearch} filterType={filterType} setFilterType={setFilterType} />
            <VehiculeTable vehicules={filteredVehicules} notifications={notifications} />
            <Totaux vehicules={filteredVehicules} />
            <div className="mt-6">
                <Link
                    href="/vehicules/depenses"
                    className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                >
                    Voir les dépenses (graphique)
                </Link>
            </div>
        </div>
    );
}