"use client";

import { useVehicules } from "@/context/vehiculesContext";
import { useTrajets } from "@/context/trajetsContext";
import { useState } from "react";
import ActionBar from "@/components/Accueil/ActionBar";
import AttribuerVehiculeModal from "@/components/Accueil/AttribuerVehiculeModal";
import VehiculesTableTrajet from "@/components/Accueil/VehiculesTableTrajet";
import Loader from "@/components/layout/Loader";
import type { Trajet } from "@/types/trajet";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import TotalTrajets from "@/components/entretiens/TotalTrajets";

const AccueilPage = () => {
  const { vehicules, updateVehicule } = useVehicules();
  const { trajets, conducteurs, addTrajet } = useTrajets();
  const isLoading = useGlobalLoading();

  const [loadingVehiculeId, setLoadingVehiculeId] = useState<number | null>(null);
  const [attribuerOpen, setAttribuerOpen] = useState(false);

  const filteredTrajets = trajets.filter((t) => t.conducteurId && t.vehiculeId);

  const calculerDuree = (heureDepart?: string, heureArrivee?: string) => {
    if (!heureDepart || !heureArrivee) return null;
    const [hdH, hdM] = heureDepart.split(":").map(Number);
    const [haH, haM] = heureArrivee.split(":").map(Number);
    let diff = haH * 60 + haM - (hdH * 60 + hdM);
    if (diff < 0) diff += 24 * 60;
    return `${Math.floor(diff / 60)}h ${String(diff % 60).padStart(2, "0")}m`;
  };

  const handleUpdateKmVehicule = async (vehiculeId: number, kmArrivee?: number) => {
    if (!kmArrivee) return;
    setLoadingVehiculeId(vehiculeId);
    try {
      await updateVehicule({ id: vehiculeId, km: kmArrivee });
    } finally {
      setLoadingVehiculeId(null);
    }
  };

  const handleAddTrajet = async (t: Trajet) => {
    await addTrajet(t);
  };
  // Loader initial uniquement si données non présentes
  if (isLoading && trajets.length === 0 && vehicules.length === 0) {
    return <Loader message="Chargement des trajets en cours..." isLoading={isLoading} fullscreen />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-800 flex-1">Gestion des trajets</h1>
        <ActionBar setAttribuerOpen={setAttribuerOpen} filteredCount={filteredTrajets.length} />
      </div>

      {attribuerOpen && (
        <AttribuerVehiculeModal
          vehicules={vehicules}
          conducteurs={conducteurs}
          trajets={trajets}
          setAttribuerOpen={setAttribuerOpen}
          addTrajet={handleAddTrajet}
        />
      )}

      <VehiculesTableTrajet
        vehicules={vehicules}
        trajets={trajets}
        conducteurs={conducteurs}
        calculerDuree={calculerDuree}
        handleUpdateKmVehicule={handleUpdateKmVehicule}
        loadingVehiculeId={loadingVehiculeId}
      />
      <TotalTrajets trajets={trajets} />
    </div>
  );
};

export default AccueilPage;
