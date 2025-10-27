"use client";

import { ReactNode, useEffect, useCallback, useState, createContext, useContext } from "react";
import type { Planification } from "@/types/trajet";
import { useTrajets } from "@/context/trajetsContext";

interface PlanificationsContextProps {
  planifications: Planification[];
  loading: boolean;
  refreshPlanifications: () => Promise<void>;
  addPlanification: (p: Omit<Planification, "id">) => Promise<Planification>;
  updatePlanification: (id: number, patch: Partial<Planification>) => Promise<Planification>;
  removePlanification: (id: number) => Promise<void>;
  getByDateRange: (startISO: string, endISO: string) => Planification[];
}

const PlanificationsContext = createContext<PlanificationsContextProps | undefined>(undefined);

export const PlanificationsProvider = ({ children }: { children: ReactNode }) => {
  const [planifications, setPlanifications] = useState<Planification[]>([]);
  const [loading, setLoading] = useState(false);
  const { refreshAll } = useTrajets();

  /** 🔄 Récupère toutes les planifications */
  const refreshPlanifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/planifications");
      if (!res.ok) new Error("Erreur lors du fetch des planifications");
      const data = await res.json();
      setPlanifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur refreshPlanifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** ➕ Ajoute une planification et crée automatiquement les trajets associés */
  const addPlanification = useCallback(
    async (p: Omit<Planification, "id">) => {
      setLoading(true);
      try {
        // 🔹 Création de la planification
        const res = await fetch("/api/planifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });

        if (!res.ok) throw new Error(await res.text());
        const created: Planification = await res.json();
        // 🔹 Création automatique des trajets
        try {
          const assignRes = await fetch("/api/vehicules/assign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              vehiculeId: created.vehiculeId,
              conducteurId: created.conducteurId,
              planificationId: created.id,
              startDate: created.startDate,
              endDate: created.endDate,
              type: created.type,
              nbreTranches: created.nbreTranches,
            }),
          });

          if (assignRes.ok) {
            await refreshAll(); // recharge les trajets & conducteurs
          } else {
            console.warn("Création des trajets échouée");
          }
        } catch (err) {
          console.error("Erreur création trajets auto:", err);
        }

        setPlanifications((prev) => [created, ...prev]);
        return created;
      } finally {
        setLoading(false);
      }
    },
    [refreshAll],
  );

  /** ✏️ Met à jour une planification */
  const updatePlanification = useCallback(async (id: number, patch: Partial<Planification>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/planifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (!res.ok) throw new Error("Erreur update planification");
      const updated = await res.json();

      setPlanifications((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🗑️ Supprime une planification */
  const removePlanification = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/planifications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur delete planification");
      setPlanifications((prev) => prev.filter((p) => p.id !== id));
      await refreshAll();
    } finally {
      setLoading(false);
    }
  }, [refreshAll]);

  /** 📅 Filtrer par intervalle de dates */
  const getByDateRange = useCallback(
    (startISO: string, endISO: string) => {
      const start = new Date(startISO).getTime();
      const end = new Date(endISO).getTime();
      return planifications.filter((p) => {
        const ps = new Date(p.startDate).getTime();
        const pe = new Date(p.endDate).getTime();
        return !(pe < start || ps > end);
      });
    },
    [planifications],
  );

  useEffect(() => {
    refreshPlanifications();
  }, [refreshPlanifications]);

  return (
    <PlanificationsContext.Provider
      value={{
        planifications,
        loading,
        refreshPlanifications,
        addPlanification,
        updatePlanification,
        removePlanification,
        getByDateRange,
      }}
    >
      {children}
    </PlanificationsContext.Provider>
  );
};

/** ✅ Hook d’accès rapide */
export const usePlanifications = () => {
  const context = useContext(PlanificationsContext);
  if (!context) throw new Error("usePlanifications must be used within PlanificationsProvider");
  return context;
};
