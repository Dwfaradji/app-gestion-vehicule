"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import type { Conducteur, Planification, Trajet } from "@/types/trajet";
import {handleTranchesAndCreateIfNeeded, updateVehiculeIfNeeded,VacancesPeriode} from "@/utils/trajetUtils";



interface TrajetsContextProps {
  conducteurs: Conducteur[];
  trajets: Trajet[];
  planifications: Planification[];
  loading: boolean;
  refreshAll: () => Promise<void>;
  refreshing: boolean;
  addTrajet: (t: Partial<Trajet>) => Promise<Trajet | null>;
  updateTrajet: (t: Partial<Trajet> & { id: number }) => Promise<Trajet | null>;
  deleteTrajet: (id: number) => Promise<boolean>;
  addConducteur: (c: Partial<Conducteur>) => Promise<Conducteur | null>;
  updateConducteur: (c: Partial<Conducteur> & { id: number }) => Promise<Conducteur | null>;
  deleteConducteur: (id: number) => Promise<boolean>;
}

const TrajetsContext = createContext<TrajetsContextProps | undefined>(undefined);

export const TrajetsProvider = ({ children }: { children: ReactNode }) => {
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([]);
  const [trajets, setTrajets] = useState<Trajet[]>([]);
  const [planifications, setPlanifications] = useState<Planification[]>([]); // ✅ nouveau
  const [loading, setLoading] = useState(true);
  const { updateVehicule } = useVehicules();
  const [, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConducteurs = useCallback(async () => {
    const res = await fetch("/api/conducteurs");
    if (!res.ok) throw new Error("Erreur fetch conducteurs");
    const data: Conducteur[] = await res.json();
    setConducteurs(data);
  }, []);

  const fetchTrajets = useCallback(async () => {
    const res = await fetch("/api/trajets");
    if (!res.ok) throw new Error("Erreur fetch trajets");
    const data: Trajet[] = await res.json();
    setTrajets(data);
  }, []);

  const fetchPlanifications = useCallback(async () => {
    const res = await fetch("/api/planifications");
    if (!res.ok) throw new Error("Erreur fetch planifications");
    const data: Planification[] = await res.json();
    setPlanifications(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchTrajets(), fetchConducteurs(), fetchPlanifications()]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchTrajets, fetchConducteurs, fetchPlanifications]);

  // ✅ Vérifie si le conducteur est déjà attribué sur une période et un type
  const conducteurDejaAttribue = useCallback(
    (conducteurId: number, type: Planification["type"]) => {
      const conflict = planifications.find((p) => {
        if (p.conducteurId !== conducteurId) return false;

        // Si un conducteur a une planification annuelle, il ne peut pas avoir d’autre véhicule
        if (p.type === "ANNUEL" || type === "ANNUEL") return true;

        // Si un conducteur a une planification mensuelle, interdit tout chevauchement inférieur
        if (p.type === "MENSUEL" && ["MENSUEL", "HEBDO", "JOUR"].includes(type)) return true;
        if (type === "MENSUEL" && ["MENSUEL", "HEBDO", "JOUR"].includes(p.type)) return true;

        // Même logique pour hebdo
        if (p.type === "HEBDO" && ["HEBDO", "JOUR"].includes(type)) return true;
        if (type === "HEBDO" && ["HEBDO", "JOUR"].includes(p.type)) return true;

        // Et pour le jour
        return p.type === "JOUR" && type === "JOUR";
      });

      return !!conflict;
    },
    [planifications],
  );

  // --- CRUD trajets (identiques à ton code)
  /** 🔹 Ajout d’un trajet */
  const addTrajet = useCallback(
    async (t: Partial<Trajet>, planif?: Planification) => {
      if (!t.conducteurId || !t.vehiculeId || !planif?.id) {
        console.warn("Trajet incomplet : conducteurId, vehiculeId ou planif manquant");
        return null;
      }

      // Vérifie si le conducteur est déjà attribué pour cette planification
      if (conducteurDejaAttribue(t.conducteurId, planif.type)) {
        alert("Ce conducteur est déjà attribué pour cette planification.");
        return null;
      }

      setLoading(true);
      try {
        // 🔹 Crée tous les trajets de la planification en une seule fois
        const res = await fetch("/api/trajets/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planificationId: planif.id,
            vehiculeId: t.vehiculeId,
            conducteurId: t.conducteurId,
            kmDepart: t.kmDepart ?? 0,
            carburant: t.carburant ?? 100,
          }),
        });

        if (!res.ok) new Error("Impossible de créer les trajets");
        const created: Trajet[] = await res.json();
        setTrajets((prev) => [...prev, ...created]);
        return created[0]; // renvoie le premier
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [conducteurDejaAttribue],
  );



    // TODO créer infos entreprise tables
    const vacances: VacancesPeriode[] = [
        { debut: "2025-10-25", fin: "2025-11-15" }, // période de vacances
    ];

    const updateTrajet = useCallback(
        async (t: Partial<Trajet> & { id: number }) => {
            setLoading(true);
            try {
                const res = await fetch("/api/trajets", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(t),
                });

                if (!res.ok) throw new Error("Impossible de mettre à jour le trajet");

                const updated: Trajet = await res.json();

                setTrajets((prev) =>
                    prev.map((tr) => (tr.id === updated.id ? updated : tr))
                );

                await updateVehiculeIfNeeded(updated, updateVehicule);

                await handleTranchesAndCreateIfNeeded({
                    updated,
                    planifications,
                    trajets,
                    setTrajets,
                    resetHour: 8, // 🕗 Ex: on veut réinitialiser à 8h du matin
                    vacances,     // 🏖️ Ex: période où on ne réinitialise plus
                });

                return updated;
            } catch (err) {
                console.error("Erreur updateTrajet:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [updateVehicule, planifications, trajets, vacances],
    );

  const deleteTrajet = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/trajets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setTrajets((prev) => prev.filter((x) => x.id !== id));
        return true;
      }
    } finally {
      setLoading(false);
    }
    return false;
  }, []);

  const addConducteur = useCallback(async (c: Partial<Conducteur>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/conducteurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      if (res.ok) {
        const saved: Conducteur = await res.json();
        setConducteurs((prev) => [...prev, saved]);
        return saved;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const updateConducteur = useCallback(async (c: Partial<Conducteur> & { id: number }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/conducteurs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      if (res.ok) {
        const updated: Conducteur = await res.json();
        setConducteurs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        return updated;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const deleteConducteur = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/conducteurs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setConducteurs((prev) => prev.filter((x) => x.id !== id));
        setTrajets((prev) =>
          prev.map((t) => (t.conducteurId === id ? { ...t, conducteurId: null } : t)),
        );
        return true;
      }
    } finally {
      setLoading(false);
    }
    return false;
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshAll();
      setInitialLoading(false);
    };
    init();
  }, [refreshAll]);

  return (
    <TrajetsContext.Provider
      value={{
        conducteurs,
        trajets,
        planifications,
        loading,
        refreshAll,
        refreshing,
        addTrajet,
        updateTrajet,
        deleteTrajet,
        addConducteur,
        updateConducteur,
        deleteConducteur,
      }}
    >
      {children}
    </TrajetsContext.Provider>
  );
};

export const useTrajets = () => {
  const context = useContext(TrajetsContext);
  if (!context) throw new Error("useTrajets must be used within a TrajetsProvider");
  return context;
};
