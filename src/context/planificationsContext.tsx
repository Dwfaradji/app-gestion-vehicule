// "use client";
//
// import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from "react";
// import { toast } from "sonner";
// import type {Planification} from "@/types/trajet";
// import { api } from "@/lib/api";
//
// interface PlanificationsContextType {
//   planifications: Planification[];
//   loading: boolean;
//
//   addPlanification: (p: Omit<Planification, "id">) => Promise<Planification>;
//   updatePlanification: (id: number, patch: Partial<Planification>) => Promise<Planification>;
//   removePlanification: (id: number) => Promise<void>;
//   getByDateRange: (startISO: string, endISO: string) => Planification[];
// }
//
// const PlanificationsContext = createContext<PlanificationsContextType | undefined>(undefined);
//
// export function PlanificationsProvider({ children }: { children: ReactNode }) {
//   const [planifications, setPlanifications] = useState<Planification[]>([]);
//   const [loading, setLoading] = useState(true);
//
//
//   // 🔄 INIT
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await api<Planification[]>("/api/planifications");
//         setPlanifications(data);
//
//       } catch (err) {
//         toast.error("Erreur lors du chargement des planifications");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);
//
//
//   // ➕ Ajout
//   const addPlanification = useCallback(
//     async (p: Omit<Planification, "id">) => {
//       setLoading(true);
//       try {
//         const created = await api<Planification>("/api/planifications", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(p),
//         });
//
//         // Création automatique des trajets associés
//         try {
//           const assignRes = await api("/api/vehicules/assign", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               vehiculeId: created.vehiculeId,
//               conducteurId: created.conducteurId,
//               planificationId: created.id,
//               startDate: created.startDate,
//               endDate: created.endDate,
//               type: created.type,
//               nbreTranches: created.nbreTranches,
//             }),
//           });
//
//           // if (assignRes) {
//           //     setTrajets((prev) => prev.map((t) => ({ ...t, planificationId: created.id })));
//           //     toast.error("Erreur lors de l'attribution des trajets");
//           // }
//
//         } catch (err) {
//           console.warn("Création des trajets échouée", err);
//         }
//
//         setPlanifications((prev) => [created, ...prev]);
//         toast.success("Planification ajoutée");
//           console.log(planifications,": planifications")
//         return created;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [planifications],
//   );
//
//   // ✏️ Update
//   const updatePlanification = useCallback(async (id: number, patch: Partial<Planification>) => {
//     setLoading(true);
//     try {
//       const updated = await api<Planification>(`/api/planifications/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(patch),
//       });
//       setPlanifications((prev) => prev.map((p) => (p.id === id ? updated : p)));
//       toast.success("Planification mise à jour");
//       return updated;
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   // 🗑 Remove
//   const removePlanification = useCallback(
//     async (id: number) => {
//       setLoading(true);
//       try {
//         await api(`/api/planifications/${id}`, { method: "DELETE" });
//         setPlanifications((prev) => prev.filter((p) => p.id !== id));
//         toast.success("Planification supprimée");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [],
//   );
//
//   // 📅 Filtrer par intervalle de dates
//   const getByDateRange = useCallback(
//     (startISO: string, endISO: string) => {
//       const start = new Date(startISO).getTime();
//       const end = new Date(endISO).getTime();
//       return planifications.filter((p) => {
//         const ps = new Date(p.startDate).getTime();
//         const pe = new Date(p.endDate).getTime();
//         return !(pe < start || ps > end);
//       });
//     },
//     [planifications],
//   );
//
//   return (
//     <PlanificationsContext.Provider
//       value={{
//         planifications,
//         loading,
//         addPlanification,
//         updatePlanification,
//         removePlanification,
//         getByDateRange,
//       }}
//     >
//       {children}
//     </PlanificationsContext.Provider>
//   );
// }
//
// export function usePlanifications() {
//   const context = useContext(PlanificationsContext);
//   if (!context)
//     throw new Error("usePlanifications must be utilisé à l'intérieur d'un PlanificationsProvider");
//   return context;
// }
