"use client";

import React from "react";
import type { Vehicule } from "@/types/vehicule";
import { Wrench, AlertCircle, Truck, CheckCircle, Clock, ShieldAlert } from "lucide-react";
import Cards from "@/components/ui/Cards";

interface TotauxProps {
  vehicules: Vehicule[];
}

interface Stat {
  icon: React.ElementType;
  color: string;
  label: string;
  value: number | string;
}

export default function Totaux({ vehicules }: TotauxProps) {
  const totalMaintenance = vehicules.filter((v) => v.statut === "Maintenance").length;
  const totalIncident = vehicules.filter((v) => v.statut === "Incident").length;
  const ctExpire = vehicules.filter(
    (v) => v.ctValidite && new Date(v.ctValidite) < new Date(),
  ).length;
  const revisionsARelancer = vehicules.filter(
    (v) => v.prochaineRevision && new Date(v.prochaineRevision) < new Date(),
  ).length;
  const totalDisponible = vehicules.filter((v) => v.statut === "Disponible").length;

  const stats: Stat[] = [
    { label: "CT expiré", value: ctExpire, icon: ShieldAlert, color: "orange" },
    { label: "Révision à refaire", value: revisionsARelancer, icon: Clock, color: "purple" },
    { label: "Incident", value: totalIncident, icon: AlertCircle, color: "red" },
    { label: "En maintenance", value: totalMaintenance, icon: Wrench, color: "yellow" },
    { label: "Disponible", value: totalDisponible, icon: CheckCircle, color: "green" },
    { label: "Total véhicules", value: vehicules.length, icon: Truck, color: "blue" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-gray-50 shadow-inner z-50 flex flex-wrap gap-4">
      <Cards cards={stats} />
    </div>
  );
}
