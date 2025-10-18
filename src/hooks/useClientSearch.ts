"use client";

import { useState, useMemo } from "react";
import type { Vehicule } from "@/types/vehicule";
import type { Conducteur, Trajet } from "@/types/trajet";

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

  /** 🚗 Véhicules disponibles et indisponibles */
  const { vehiculesDisponibles, vehiculesIndisponibles } = useMemo(() => {
    const dispo: Vehicule[] = [];
    const indispo: Vehicule[] = [];

    vehicules.forEach((v) => {
      const enTrajet = trajets.some((t) => t.vehiculeId === v.id && !t.heureArrivee);
      const statutIndispo = v.statut === "Maintenance" || v.statut === "Incident";

      if (!enTrajet && !statutIndispo) {
        dispo.push(v);
      } else {
        indispo.push(v);
      }
    });

    // 🔧 Filtre infos manquantes
    const filterInfos = (arr: Vehicule[]) =>
      infosManquantesOnly ? arr.filter((v) => !v.immat || !v.modele || !v.type) : arr;

    return {
      vehiculesDisponibles: filterInfos(dispo),
      vehiculesIndisponibles: filterInfos(indispo),
    };
  }, [vehicules, trajets, infosManquantesOnly]);

  /** 📊 Trajets filtrés */
  const filteredTrajets = useMemo(() => {
    const searchLower = search.toLowerCase();

    return trajets.filter((t) => {
      const vehicule = vehicules.find((v) => v.id === t.vehiculeId);
      const conducteur = conducteurs.find((c) => c.id === t.conducteurId);
      if (!vehicule) return false;

      if (infosManquantesOnly) {
        const infosManquantes =
          !t.kmDepart ||
          !t.kmArrivee ||
          !t.heureDepart ||
          !t.heureArrivee ||
          !t.destination ||
          !t.conducteurId;
        if (!infosManquantes) return false;
      }

      if (disponibleOnly && !vehiculesDisponibles.some((v) => v.id === vehicule.id)) return false;
      if (selectedVehicule && vehicule.id !== Number(selectedVehicule)) return false;
      if (selectedConducteur && conducteur?.id !== Number(selectedConducteur)) return false;

      const created = new Date(t.createdAt);
      if (dateStart && created < new Date(dateStart)) return false;
      if (dateEnd && created > new Date(dateEnd)) return false;

      const hd = t.heureDepart ?? "00:00";
      const ha = t.heureArrivee ?? "23:59";
      if (heureStart && hd < heureStart) return false;
      if (heureEnd && ha > heureEnd) return false;

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
    vehiculesIndisponibles,
  };
};
