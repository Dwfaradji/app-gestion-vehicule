// "use client";
//
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   ReactNode,
// } from "react";
// import { toast } from "sonner";
// import { api } from "@/lib/api";
// import type { Trajet, Conducteur, Planification } from "@/types/trajet";
//
// interface TrajetsContextType {
//   conducteurs: Conducteur[];
//   trajets: Trajet[];
//   planifications: Planification[];
//   loading: boolean;
//
//   addTrajet: (t: Partial<Trajet>, planif: Planification) => Promise<Trajet | null>;
//   updateTrajet: (t: Partial<Trajet> & { id: number }) => Promise<Trajet | null>;
//   deleteTrajet: (id: number) => Promise<void>;
//
//   addConducteur: (c: Partial<Conducteur>) => Promise<Conducteur | null>;
//   updateConducteur: (c: Partial<Conducteur> & { id: number }) => Promise<Conducteur | null>;
//   deleteConducteur: (id: number) => Promise<void>;
// }
//
// const TrajetsContext = createContext<TrajetsContextType | undefined>(undefined);
//
// export function TrajetsProvider({ children }: { children: ReactNode }) {
//   const [conducteurs, setConducteurs] = useState<Conducteur[]>([]);
//   const [trajets, setTrajets] = useState<Trajet[]>([]);
//   const [planifications, setPlanifications] = useState<Planification[]>([]);
//   const [loading, setLoading] = useState(true);
//
//   // ---------------------------------
//   // 🔄 INIT
//   // ---------------------------------
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const [c, t, p] = await Promise.all([
//           api<Conducteur[]>("/api/conducteurs"),
//           api<Trajet[]>("/api/trajets"),
//           api<Planification[]>("/api/planifications"),
//         ]);
//         setConducteurs(c);
//         setTrajets(t);
//         setPlanifications(p);
//
//       } catch (err) {
//         console.error(err);
//         toast.error("Erreur lors du chargement initial des trajets");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);
//
//   // ---------------------------------
//   // 🏎 TRAJETS
//   // ---------------------------------
//   const addTrajet = useCallback(
//     async (t: Partial<Trajet>, planif: Planification) => {
//       if (!t.conducteurId || !t.vehiculeId) return null;
//
//       const conflict = planifications.some(
//         (p) => p.conducteurId === t.conducteurId && p.type === planif.type,
//       );
//       if (conflict) {
//         toast.error("Ce conducteur est déjà attribué pour cette planification.");
//         return null;
//       }
//
//       try {
//         const created: Trajet[] = await api<Trajet[]>("/api/trajets", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ...t, planificationId: planif.id }),
//         });
//         setTrajets((prev) => [...prev, ...created]);
//         toast.success("Trajet créé !");
//         return created[0];
//       } catch (err) {
//         console.error(err);
//         toast.error("Erreur lors de la création du trajet");
//         return null;
//       }
//     },
//     [planifications],
//   );
//
//   const updateTrajet = useCallback(async (t: Partial<Trajet> & { id: number }) => {
//     try {
//       const updated = await api<Trajet>("/api/trajets", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(t),
//       });
//       setTrajets((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
//       toast.success("Trajet mis à jour !");
//       return updated;
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur mise à jour trajet");
//       return null;
//     }
//   }, []);
//
//   const deleteTrajet = useCallback(async (id: number) => {
//     try {
//       await api("/api/trajets", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       setTrajets((prev) => prev.filter((t) => t.id !== id));
//       toast.success("Trajet supprimé !");
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur suppression trajet");
//     }
//   }, []);
//
//   // ---------------------------------
//   // 👨‍✈️ CONDUCTEURS
//   // ---------------------------------
//   const addConducteur = useCallback(async (c: Partial<Conducteur>) => {
//     try {
//       const saved = await api<Conducteur>("/api/conducteurs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(c),
//       });
//       setConducteurs((prev) => [...prev, saved]);
//       toast.success("Conducteur ajouté !");
//       return saved;
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur ajout conducteur");
//       return null;
//     }
//   }, []);
//
//   const updateConducteur = useCallback(async (c: Partial<Conducteur> & { id: number }) => {
//     try {
//       const updated = await api<Conducteur>("/api/conducteurs", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(c),
//       });
//       setConducteurs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
//       toast.success("Conducteur mis à jour !");
//       return updated;
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur mise à jour conducteur");
//       return null;
//     }
//   }, []);
//
//   const deleteConducteur = useCallback(async (id: number) => {
//     try {
//       await api("/api/conducteurs", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       setConducteurs((prev) => prev.filter((x) => x.id !== id));
//       setTrajets((prev) =>
//         prev.map((t) => (t.conducteurId === id ? { ...t, conducteurId: null } : t)),
//       );
//       toast.success("Conducteur supprimé !");
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur suppression conducteur");
//     }
//   }, []);
//
//   return (
//     <TrajetsContext.Provider
//       value={{
//         conducteurs,
//         trajets,
//         planifications,
//         loading,
//         addTrajet,
//         updateTrajet,
//         deleteTrajet,
//         addConducteur,
//         updateConducteur,
//         deleteConducteur,
//       }}
//     >
//       {children}
//     </TrajetsContext.Provider>
//   );
// }
//
// export function useTrajets() {
//   const context = useContext(TrajetsContext);
//   if (!context) throw new Error("useTrajets doit être utilisé à l’intérieur d’un TrajetsProvider");
//   return context;
// }

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Trajet, Conducteur, Planification } from "@/types/trajet";

interface TrajetsContextType {
  conducteurs: Conducteur[];
  trajets: Trajet[];
  planifications: Planification[];
  loading: boolean;

  // 🔄 synchronisation manuelle si besoin
  // refreshAll: () => Promise<void>;

  // 👨‍✈️ Conducteurs
  addConducteur: (c: Partial<Conducteur>) => Promise<Conducteur | null>;
  updateConducteur: (c: Partial<Conducteur> & { id: number }) => Promise<Conducteur | null>;
  deleteConducteur: (id: number) => Promise<void>;

  // 🗓 Planifications
  addPlanification: (p: Omit<Planification, "id">) => Promise<Planification | null>;
  updatePlanification: (id: number, patch: Partial<Planification>) => Promise<Planification | null>;
  deletePlanification: (id: number) => Promise<void>;

  getByDateRange: (startISO: string, endISO: string) => Planification[];

  // 🚗 Trajets
  addTrajet: (t: Partial<Trajet>, planif: Planification) => Promise<Trajet | null>;
  updateTrajet: (t: Partial<Trajet> & { id: number }) => Promise<Trajet | null>;
  deleteTrajet: (id: number) => Promise<void>;
}

const TrajetsContext = createContext<TrajetsContextType | undefined>(undefined);

export function TrajetsProvider({ children }: { children: ReactNode }) {
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([]);
  const [trajets, setTrajets] = useState<Trajet[]>([]);
  const [planifications, setPlanifications] = useState<Planification[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------
  // 🔄 INITIALISATION
  // ---------------------------------

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [c, t, p] = await Promise.all([
          api<Conducteur[]>("/api/conducteurs"),
          api<Trajet[]>("/api/trajets"),
          api<Planification[]>("/api/planifications"),
        ]);
        setConducteurs(c);
        setTrajets(t);
        setPlanifications(p);
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement initial des trajets");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------------------------------
  // 👨‍✈️ CONDUCTEURS
  // ---------------------------------
  const addConducteur = useCallback(async (c: Partial<Conducteur>) => {
    try {
      const saved = await api<Conducteur>("/api/conducteurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      setConducteurs((prev) => [...prev, saved]);
      toast.success("Conducteur ajouté !");
      return saved;
    } catch (err) {
      console.error(err);
      toast.error("Erreur ajout conducteur");
      return null;
    }
  }, []);

  const updateConducteur = useCallback(async (c: Partial<Conducteur> & { id: number }) => {
    try {
      const updated = await api<Conducteur>("/api/conducteurs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      setConducteurs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      toast.success("Conducteur mis à jour !");
      return updated;
    } catch (err) {
      console.error(err);
      toast.error("Erreur mise à jour conducteur");
      return null;
    }
  }, []);

  const deleteConducteur = useCallback(async (id: number) => {
    try {
      await api("/api/conducteurs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setConducteurs((prev) => prev.filter((x) => x.id !== id));
      // Détacher les trajets liés
      setTrajets((prev) =>
        prev.map((t) => (t.conducteurId === id ? { ...t, conducteurId: null } : t)),
      );
      toast.success("Conducteur supprimé !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur suppression conducteur");
    }
  }, []);

  // ---------------------------------
  // 🗓 PLANIFICATIONS
  // ---------------------------------
  const addPlanification = useCallback(async (p: Omit<Planification, "id">) => {
    try {
      const created = await api<Planification>("/api/planifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });

      // Création automatique des trajets associés
      try {
        await api("/api/vehicules/assign", {
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
        // ✅ Recharge les trajets après la création
        const t = await api<Trajet[]>("/api/trajets");
        setTrajets(t);
      } catch (err) {
        console.warn("Création des trajets échouée", err);
      }

      setPlanifications((prev) => [created, ...prev]);
      toast.success("Planification ajoutée !");
      return created;
    } catch (err) {
      console.error(err);
      toast.error("Erreur ajout planification");
      return null;
    }
  }, []);

  const updatePlanification = useCallback(async (id: number, patch: Partial<Planification>) => {
    try {
      const updated = await api<Planification>(`/api/planifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setPlanifications((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success("Planification mise à jour !");
      return updated;
    } catch (err) {
      console.error(err);
      toast.error("Erreur mise à jour planification");
      return null;
    }
  }, []);

  const deletePlanification = useCallback(async (id: number) => {
    try {
      await api(`/api/planifications/${id}`, { method: "DELETE" });
      setPlanifications((prev) => prev.filter((p) => p.id !== id));
      // Supprimer les trajets liés
      setTrajets((prev) => prev.filter((t) => t.planificationId !== id));
      toast.success("Planification supprimée !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur suppression planification");
    }
  }, []);

  // ---------------------------------
  // 🚗 TRAJETS
  // ---------------------------------
  const addTrajet = useCallback(
    async (t: Partial<Trajet>, planif: Planification) => {
      if (!t.conducteurId || !t.vehiculeId) return null;

      const conflict = planifications.some(
        (p) => p.conducteurId === t.conducteurId && p.type === planif.type,
      );
      if (conflict) {
        toast.error("Ce conducteur est déjà attribué pour cette planification.");
        return null;
      }

      try {
        const created: Trajet[] = await api<Trajet[]>("/api/trajets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...t, planificationId: planif.id }),
        });
        setTrajets((prev) => [...prev, ...created]);
        toast.success("Trajet créé !");
        return created[0];
      } catch (err) {
        console.error(err);
        toast.error("Erreur création trajet");
        return null;
      }
    },
    [planifications],
  );

  const updateTrajet = useCallback(async (t: Partial<Trajet> & { id: number }) => {
    try {
      const updated = await api<Trajet>("/api/trajets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      setTrajets((prev) => prev.map((tr) => (tr.id === updated.id ? updated : tr)));
      toast.success("Trajet mis à jour !");
      return updated;
    } catch (err) {
      console.error(err);
      toast.error("Erreur mise à jour trajet");
      return null;
    }
  }, []);

  const deleteTrajet = useCallback(async (id: number) => {
    try {
      await api("/api/trajets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setTrajets((prev) => prev.filter((t) => t.id !== id));
      toast.success("Trajet supprimé !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur suppression trajet");
    }
  }, []);

  // 📅 Filtrer par intervalle de dates
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

  // ---------------------------------
  // ✅ EXPORT DU CONTEXTE
  // ---------------------------------
  return (
    <TrajetsContext.Provider
      value={{
        conducteurs,
        trajets,
        planifications,
        loading,

        addConducteur,
        updateConducteur,
        deleteConducteur,
        addPlanification,
        updatePlanification,
        deletePlanification,
        addTrajet,
        updateTrajet,
        deleteTrajet,
        getByDateRange,
      }}
    >
      {children}
    </TrajetsContext.Provider>
  );
}

export function useTrajets() {
  const context = useContext(TrajetsContext);
  if (!context) throw new Error("useTrajets doit être utilisé à l’intérieur d’un TrajetsProvider");
  return context;
}
