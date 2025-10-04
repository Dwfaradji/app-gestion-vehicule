"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Vehicule } from "@/types/vehicule";
import { Conducteur, Trajet } from "@/types/trajet";
import { SearchBarAdvanced } from "@/components/ui/SearchBarAdvanced";
import { useClientSearch } from "@/hooks/useClientSearch";
import {useTrajets} from "@/context/trajetsContext";
import Loader from "@/components/layout/Loader";

interface VehiculesTableAccueilProps {
    vehicules: Vehicule[];
    trajets: Trajet[];
    conducteurs: Conducteur[];
    calculerDuree: (heureDepart?: string, heureArrivee?: string) => string | null;
    handleUpdateKmVehicule: (vehiculeId: number, kmArrivee?: number) => void;
    loadingVehiculeId: number | null;
}

export default function VehiculesTableTrajet({
                                                  vehicules,
                                                  trajets,
                                                  conducteurs,
                                                  calculerDuree,
                                                  handleUpdateKmVehicule,
                                                  loadingVehiculeId,
                                              }: VehiculesTableAccueilProps) {
    const router = useRouter();
    // Hook de recherche client
    const {
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
        resetFilters,
        filteredTrajets,
        vehiculesDisponibles,
        infosManquantesOnly,
        setInfosManquantesOnly,
    } = useClientSearch({ vehicules, trajets, conducteurs });

    // Pagination simple
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ✅ Réinitialise la page à 1 quand un filtre change
    useEffect(() => {
        setCurrentPage(1);
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
    ]);

    // ✅ Sécurise la pagination
    const totalPages = Math.max(1, Math.ceil(filteredTrajets.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedTrajets = filteredTrajets.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage
    );

    const getEtatTrajet = (t: Trajet) => {
        if (!t.conducteurId) return { label: "Aucun conducteur", color: "bg-red-100 text-red-700" };
        if (!t.kmDepart || !t.kmArrivee || !t.heureDepart || !t.heureArrivee || !t.destination)
            return { label: "Infos manquantes", color: "bg-yellow-100 text-yellow-700" };
        return { label: "Complet", color: "bg-green-100 text-green-700" };
    };

    return (
        <div className="space-y-6">
            <SearchBarAdvanced
                vehicules={vehicules}
                conducteurs={conducteurs}
                search={search}
                setSearch={setSearch}
                selectedVehicule={selectedVehicule}
                setSelectedVehicule={setSelectedVehicule}
                selectedConducteur={selectedConducteur}
                setSelectedConducteur={setSelectedConducteur}
                dateStart={dateStart}
                setDateStart={setDateStart}
                dateEnd={dateEnd}
                setDateEnd={setDateEnd}
                heureStart={heureStart}
                setHeureStart={setHeureStart}
                heureEnd={heureEnd}
                setHeureEnd={setHeureEnd}
                disponibleOnly={disponibleOnly}
                setDisponibleOnly={setDisponibleOnly}
                infosManquantesOnly={infosManquantesOnly}
                setInfosManquantesOnly={setInfosManquantesOnly}
                resetFilters={resetFilters}
            />

            {/* Véhicules disponibles */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="font-semibold mb-2">
                    Véhicules disponibles ({vehiculesDisponibles.length})
                </h3>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                        {["Type", "Modèle", "Immatriculation", "Disponibilité", "Trajets en cours"].map(
                            (t) => (
                                <th
                                    key={t}
                                    className="px-4 py-2 text-left font-medium tracking-wider"
                                >
                                    {t}
                                </th>
                            )
                        )}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {vehiculesDisponibles.map((v) => {
                        const trajetsEnCours = trajets.filter(
                            (t) => t.vehiculeId === v.id && !t.heureArrivee
                        ).length;
                        return (
                            <tr
                                key={v.id}
                                onClick={() => router.push(`/details-trajet/${v.id}`)}
                                className="cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out"
                            >
                                <td className="px-4 py-2">{v.type}</td>
                                <td className="px-4 py-2">{v.modele}</td>
                                <td className="px-4 py-2 font-medium">{v.immat}</td>
                                <td className="px-4 py-2">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Disponible
                    </span>
                                </td>
                                <td className="px-4 py-2">{trajetsEnCours}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Tableau des trajets */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        {[
                            "Type",
                            "Modèle",
                            "Énergie",
                            "Immatriculation",
                            "Km total",
                            "Conducteur",
                            "Destination",
                            "Km départ",
                            "Km arrivée",
                            "Heure départ",
                            "Heure arrivée",
                            "Durée",
                            "Date",
                            "État",
                            "Actions",
                        ].map((t) => (
                            <th
                                key={t}
                                className="px-4 py-3 text-left font-semibold tracking-wider"
                            >
                                {t}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {paginatedTrajets.map((t) => {
                        const vehicule = vehicules.find((v) => v.id === t.vehiculeId);
                        const conducteur = conducteurs.find((c) => c.id === t.conducteurId);
                        const etat = getEtatTrajet(t);
                        const duree = calculerDuree(t.heureDepart, t.heureArrivee);

                        return (
                            <tr
                                key={t.id}
                                onClick={() => router.push(`/details-trajet/${vehicule?.id}`)}
                                className="cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out even:bg-gray-50"
                            >
                                <td className="px-4 py-3">{vehicule?.type}</td>
                                <td className="px-4 py-3">{vehicule?.modele}</td>
                                <td className="px-4 py-3">{vehicule?.energie}</td>
                                <td className="px-4 py-3 font-medium">{vehicule?.immat}</td>
                                <td className="px-4 py-3">{vehicule?.km.toLocaleString()} km</td>
                                <td className="px-4 py-3">
                                    {conducteur
                                        ? `${conducteur.prenom} ${conducteur.nom}`
                                        : "-"}
                                </td>
                                <td className="px-4 py-3">{t.destination || "-"}</td>
                                <td className="px-4 py-3">{t.kmDepart ?? "-"}</td>
                                <td className="px-4 py-3">{t.kmArrivee ?? "-"}</td>
                                <td className="px-4 py-3">{t.heureDepart || "-"}</td>
                                <td className="px-4 py-3">{t.heureArrivee || "-"}</td>
                                <td className="px-4 py-3">{duree || "-"}</td>
                                <td className="px-4 py-3">
                                    {t.createdAt
                                        ? new Date(t.createdAt).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="px-4 py-3">
                    <span
                        className={clsx(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            etat.color
                        )}
                    >
                      {etat.label}
                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {vehicule?.id != null && t.kmArrivee != null && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateKmVehicule(
                                                    vehicule.id,
                                                    t.kmArrivee ?? undefined
                                                );
                                            }}
                                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                                        >
                                            {loadingVehiculeId === vehicule.id ? "..." : "Mettre à jour km"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {/* ✅ Pagination robuste */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 py-4">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-2">
              Page {safePage} / {totalPages}
            </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}