"use client";

import React, { useState, useMemo } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import { useTrajets } from "@/context/trajetsContext";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

import ActionBar from "@/components/trajets/ActionBar";
import VehiculesTableTrajet from "@/components/trajets/VehiculesTableTrajet";
import Totaux from "@/components/entretiens/Total";
import Loader from "@/components/layout/Loader";

import type { Trajet } from "@/types/trajet";
import useStats from "@/hooks/useStats";
import { AlertCircle, CheckCircle, MapPin, Truck } from "lucide-react";
import PlanifierAttributionModal from "@/components/planification/PlanifierAttributionModal";
import { motion } from "framer-motion";

const GestionTrajets = () => {
  const { vehicules, updateVehicule } = useVehicules();
  const { trajets, conducteurs } = useTrajets();
  const isLoading = useGlobalLoading();

  const [loadingVehiculeId, setLoadingVehiculeId] = useState<number | null>(null);
  const [attribuerOpen, setAttribuerOpen] = useState(false);

  // Filtrer uniquement les trajets valides
  const filteredTrajets = useMemo(
    () => trajets.filter((t) => t.conducteurId && t.vehiculeId),
    [trajets],
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

  // Calcul des statistiques
  const statsTrajets = useStats<Trajet>({
    data: trajets,
    metrics: [
      // Trajets effectués (complets)
      {
        label: "Trajets effectués",
        value: (t) =>
          t.filter(
            (tr) =>
              tr.kmDepart != null &&
              tr.kmArrivee != null &&
              tr.heureDepart &&
              tr.heureArrivee &&
              tr.destination,
          ).length,
        color: "blue",
        icon: MapPin,
      },
      // Trajets en cours
      {
        label: "Trajets en cours",
        value: (t) =>
          t.filter(
            (tr) =>
              tr.kmDepart == null || tr.kmArrivee == null || !tr.heureDepart || !tr.heureArrivee,
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
              .filter(
                (tr) =>
                  tr.kmDepart == null ||
                  tr.kmArrivee == null ||
                  !tr.heureDepart ||
                  !tr.heureArrivee,
              )
              .map((tr) => tr.conducteurId)
              .filter(Boolean),
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
              .filter(
                (tr) =>
                  tr.kmDepart == null ||
                  tr.kmArrivee == null ||
                  !tr.heureDepart ||
                  !tr.heureArrivee,
              )
              .map((tr) => tr.vehiculeId)
              .filter(Boolean),
          );
          return vehicules.length - vehiculesAttribues.size;
        },
        color: "green",
        icon: Truck,
      },
      // Trajets avec infos manquantes
      {
        label: "Infos manquantes",
        value: (t) =>
          t.filter(
            (tr) =>
              !tr.kmDepart ||
              !tr.kmArrivee ||
              !tr.heureDepart ||
              !tr.heureArrivee ||
              !tr.destination,
          ).length,
        color: "red",
        icon: AlertCircle,
      },
    ],
  });

  // Loader initial uniquement si les données ne sont pas encore chargées
  if (isLoading && trajets.length === 0 && vehicules.length === 0) {
    return <Loader message="Chargement des trajets en cours..." isLoading={isLoading} fullscreen />;
  }

  return (
    <div className="min-h-screen">
      {/* Header + actions */}

      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-300 dark:border-gray-700 ">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold flex items-center gap-2"
        >
          Gestion des Trajets
        </motion.h1>
        <ActionBar setAttribuerOpen={setAttribuerOpen} filteredCount={filteredTrajets.length} />

        <PlanifierAttributionModal
          isOpen={attribuerOpen}
          onClose={() => setAttribuerOpen(false)}
          vehicules={vehicules}
          conducteurs={conducteurs}
        />
      </div>

      {/* Modale d’attribution */}

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
      <Totaux
        stats={statsTrajets}
        openLabel="Afficher les stats trajet"
        closeLabel="Réduire le tableau de bord"
      />
    </div>
  );
};

export default GestionTrajets;
