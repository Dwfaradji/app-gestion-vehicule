"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import type { Conducteur, Trajet } from "@/types/trajet";

interface TrajetsContextProps {
  conducteurs: Conducteur[];
  trajets: Trajet[];
  loading: boolean; // ✅ loading global
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
  const [loading, setLoading] = useState(true); // ✅ initialisation
  const { updateVehicule } = useVehicules();
  const [, setInitialLoading] = useState(true); // loader global
  const [refreshing, setRefreshing] = useState(false); // loader refresh local

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

  const refreshAll = useCallback(async () => {
    setLoading(true); // ⏳ début du chargement global
    try {
      await Promise.all([fetchTrajets(), fetchConducteurs()]);
    } finally {
      setLoading(false); // ✅ fin du chargement
      setRefreshing(false);
    }
  }, [fetchTrajets, fetchConducteurs]);

  const addTrajet = useCallback(async (t: Partial<Trajet>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/trajets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      if (res.ok) {
        const saved: Trajet = await res.json();
        setTrajets((prev) => [...prev, saved]);
        return saved;
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const updateTrajet = useCallback(
    async (t: Partial<Trajet> & { id: number }) => {
      setLoading(true);
      try {
        const res = await fetch("/api/trajets", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t),
        });
        if (res.ok) {
          const updated: Trajet = await res.json();
          setTrajets((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));

          if (updated.kmArrivee) {
            await updateVehicule({ id: updated.vehiculeId, km: updated.kmArrivee });
          }

          return updated;
        }
      } finally {
        setLoading(false);
      }
      return null;
    },
    [updateVehicule],
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
      setInitialLoading(false); // loader global au premier chargement
    };
    init();
  }, [refreshAll]);

  return (
    <TrajetsContext.Provider
      value={{
        conducteurs,
        trajets,
        loading, // ✅ expose loading
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
