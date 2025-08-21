// app/vehicules/page.tsx
"use client";
import { useMemo, useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useNotifications } from "@/context/NotificationsContext";
import SearchBar from "@/components/SearchBar";
import VehiculeTable from "@/components/Table";
import Totaux from "@/components/Total";
import Header from "@/components/Header";
import Link from "next/link";

export default function VehiculesPage() {
    const { vehicules } = useData();
    const { notifications, refreshNotifications } = useNotifications();
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string | null>(null);

    // Exemples de paramètres
    const parametres = useMemo(() => [
        { type: "Freins", seuilKm: 15000, dernierKm: 70000 },
        { type: "Vidange", seuilKm: 10000, dernierKm: 80000 },
        { type: "CT", seuilKm: 0 },
    ], []);

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