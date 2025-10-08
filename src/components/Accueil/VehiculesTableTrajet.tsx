"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Vehicule } from "@/types/vehicule";
import { Conducteur, Trajet } from "@/types/trajet";
import { SearchBarAdvanced } from "@/components/ui/SearchBarAdvanced";
import { useClientSearch } from "@/hooks/useClientSearch";
import Table from "@/components/ui/Table"; // ✅ table réutilisable
import Loader from "@/components/layout/Loader";
import ActionButtons from "@/components/ui/ActionButtons";
import Pagination from "@/components/ui/Pagination";

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

    const [currentPageData, setCurrentPageData] = useState<Trajet[]>([]);



    const getEtatTrajet = (t: Trajet) => {
        if (!t.conducteurId)
            return { label: "Aucun conducteur", color: "bg-red-100 text-red-700" };
        if (!t.kmDepart || !t.kmArrivee || !t.heureDepart || !t.heureArrivee || !t.destination)
            return { label: "Infos manquantes", color: "bg-yellow-100 text-yellow-700" };
        return { label: "Complet", color: "bg-green-100 text-green-700" };
    };

    return (
        <div className="space-y-6">
            {/* Barre de recherche */}
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

            {/* 🟢 Table Véhicules disponibles */}
            <div className="border border-gray-200 rounded-xl bg-gray-50 p-4 shadow-sm">
                <h3 className="font-semibold mb-3">
                    Véhicules disponibles ({vehiculesDisponibles.length})
                </h3>

                <Table
                    data={vehiculesDisponibles}
                    onRowClick={(v) => router.push(`/details-trajet/${v.id}`)}
                    columns={[
                        { key: "type", label: "Type" },
                        { key: "modele", label: "Modèle" },
                        { key: "immat", label: "Immatriculation", render: (v) => <span className="font-medium">{v.immat}</span> },
                        {
                            key: "statut",
                            label: "Disponibilité",
                            render: () => (
                                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Disponible
                </span>
                            ),
                        },
                        {
                            key: "trajets",
                            label: "Trajets en cours",
                            render: (v) => trajets.filter((t) => t.vehiculeId === v.id && !t.heureArrivee).length,
                        },
                    ]}
                />
            </div>

            {/* 🟣 Table des trajets */}
            <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm">
                <Table
                    data={currentPageData}
                    onRowClick={(t) => {
                        const vehicule = vehicules.find((v) => v.id === t.vehiculeId);
                        if (vehicule) router.push(`/details-trajet/${vehicule.id}`);
                    }}
                    columns={[
                        { key: "type", label: "Type", render: (t) => vehicules.find((v) => v.id === t.vehiculeId)?.type },
                        { key: "modele", label: "Modèle", render: (t) => vehicules.find((v) => v.id === t.vehiculeId)?.modele },
                        { key: "energie", label: "Énergie", render: (t) => vehicules.find((v) => v.id === t.vehiculeId)?.energie },
                        { key: "immat", label: "Immatriculation", render: (t) => vehicules.find((v) => v.id === t.vehiculeId)?.immat },
                        { key: "km", label: "Km total", render: (t) => `${vehicules.find((v) => v.id === t.vehiculeId)?.km.toLocaleString()} km` },
                        {
                            key: "conducteur",
                            label: "Conducteur",
                            render: (t) => {
                                const c = conducteurs.find((c) => c.id === t.conducteurId);
                                return c ? `${c.prenom} ${c.nom}` : "-";
                            },
                        },
                        { key: "destination", label: "Destination", render: (t) => t.destination || "-" },
                        { key: "kmDepart", label: "Km départ", render: (t) => t.kmDepart ?? "-" },
                        { key: "kmArrivee", label: "Km arrivée", render: (t) => t.kmArrivee ?? "-" },
                        { key: "heureDepart", label: "Heure départ", render: (t) => t.heureDepart || "-" },
                        { key: "heureArrivee", label: "Heure arrivée", render: (t) => t.heureArrivee || "-" },
                        { key: "duree", label: "Durée", render: (t) => calculerDuree(t.heureDepart, t.heureArrivee) || "-" },
                        {
                            key: "date",
                            label: "Date",
                            render: (t) =>
                                t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-",
                        },
                        {
                            key: "etat",
                            label: "État",
                            render: (t) => {
                                const e = getEtatTrajet(t);
                                return (
                                    <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", e.color)}>
                    {e.label}
                  </span>
                                );
                            },
                        },
                        {
                            key: "actions",
                            label: "Actions",
                            render: (t) => {
                                const vehicule = vehicules.find((v) => v.id === t.vehiculeId);
                                if (!vehicule?.id || t.kmArrivee == null) return null;

                                return (
                                    <ActionButtons
                                        row={t}
                                        buttons={[
                                            {
                                                icon: "Check",
                                                color: "blue",
                                                tooltip: "Mettre à jour km",
                                                onClick: () => handleUpdateKmVehicule(vehicule.id, t.kmArrivee),
                                            },
                                        ]}
                                    />
                                );
                            },
                        },
                    ]}
                />

                {/* Pagination */}

                    <div>

                        <Pagination
                            data={filteredTrajets}
                            itemsPerPage={10}
                            onPageChange={setCurrentPageData}
                        />

                    </div>
            </div>
        </div>
    );
}