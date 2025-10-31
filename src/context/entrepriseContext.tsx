// // import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// // import { Entreprise, Section, Horaire, Vacances } from "@/types/entreprise";
// //
// // interface EntrepriseContextType {
// //   entreprises: Entreprise[];
// //   selectedEntreprise: Entreprise | null;
// //   sections: Section[];
// //   horaires: Horaire[];
// //   vacances: Vacances[];
// //   loading: boolean;
// //
// //   refreshEntreprises: () => Promise<void>;
// //   selectEntreprise: (entreprise: Entreprise | null) => void;
// //
// //   addEntreprise: (data: Partial<Entreprise>) => Promise<void>;
// //   updateEntreprise: (id: number, data: Partial<Entreprise>) => Promise<void>;
// //   deleteEntreprise: (id: number) => Promise<void>;
// //
// //   addSection: (data: Partial<Section>) => Promise<Section>;
// //   updateSection: (id: number, data: Partial<Section>) => Promise<void>;
// //   deleteSection: (id: number) => Promise<void>;
// //
// //   addHoraire: (data: Partial<Horaire>) => Promise<Horaire>;
// //   updateHoraire: (id: number, data: Partial<Horaire>) => Promise<void>;
// //   deleteHoraire: (id: number) => Promise<void>;
// //
// //   addVacances: (data: Partial<Vacances>) => Promise<Vacances>;
// //   updateVacances: (id: number, data: Partial<Vacances>) => Promise<void>;
// //   deleteVacances: (id: number) => Promise<void>;
// //
// //   getSectionById: (id: number) => Section | undefined;
// // }
// //
// // const EntrepriseContext = createContext<EntrepriseContextType | undefined>(undefined);
// //
// // function EntrepriseProvider({ children }: { children: ReactNode }) {
// //   const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
// //   const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
// //   const [sections, setSections] = useState<Section[]>([]);
// //   const [horaires, setHoraires] = useState<Horaire[]>([]);
// //   const [vacances, setVacances] = useState<Vacances[]>([]);
// //   const [loading, setLoading] = useState(true);
// //
// //   // ------------------------------
// //   // Fetch entreprises
// //   // ------------------------------
// //   const refreshEntreprises = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch("/api/entreprises");
// //       const data: Entreprise[] = await res.json();
// //       setEntreprises(data);
// //       if (data.length > 0) selectEntreprise(data[0]);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //
// //   // ------------------------------
// //   // Fetch sections
// //   // ------------------------------
// //   const refreshSections = async (entrepriseId?: number) => {
// //     if (!entrepriseId) return setSections([]);
// //     try {
// //       const res = await fetch("/api/entreprises/sections");
// //       const data: Section[] = await res.json();
// //       setSections(data);
// //     } catch (err) {
// //       console.error(err);
// //       setSections([]);
// //     }
// //   };
// //
// //   // ------------------------------
// //   // Fetch vacances
// //   // ------------------------------
// //   const refreshVacances = async () => {
// //     try {
// //       const res = await fetch("/api/entreprises/vacances");
// //       const data: Vacances[] = await res.json();
// //       setVacances(data);
// //     } catch (err) {
// //       console.error(err);
// //       setVacances([]);
// //     }
// //   };
// //
// //   // ------------------------------
// //   // Select entreprise
// //   // ------------------------------
// //   const selectEntreprise = (entreprise: Entreprise | null) => {
// //     setSelectedEntreprise(entreprise);
// //     if (entreprise) refreshSections(entreprise.id);
// //   };
// //
// //   // ------------------------------
// //   // CRUD Entreprise
// //   // ------------------------------
// //   const addEntreprise = async (data: Partial<Entreprise>) => {
// //     const res = await fetch("/api/entreprises", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(data),
// //     });
// //     if (!res.ok) throw new Error("Erreur création entreprise");
// //     await refreshEntreprises();
// //   };
// //
// //   const updateEntreprise = async (id: number, data: Partial<Entreprise>) => {
// //     const res = await fetch("/api/entreprises/", {
// //       method: "PUT",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ data, id }),
// //     });
// //     if (!res.ok) throw new Error("Erreur update entreprise");
// //     await refreshEntreprises();
// //   };
// //
// //   const deleteEntreprise = async (id: number) => {
// //     const res = await fetch("/api/entreprises/", {
// //       method: "DELETE",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ id }),
// //     });
// //     if (!res.ok) throw new Error("Erreur delete entreprise");
// //     await refreshEntreprises();
// //   };
// //
// //   // ------------------------------
// //   // CRUD Section
// //   // ------------------------------
// //   const addSection = async (data: Partial<Section>): Promise<Section> => {
// //     const res = await fetch("/api/entreprises/sections", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(data),
// //     });
// //     if (!res.ok) throw new Error("Erreur création section");
// //     const section: Section = await res.json();
// //     await refreshSections(data.entrepriseId);
// //     return section;
// //   };
// //
// //   const updateSection = async (id: number, data: Partial<Section>) => {
// //     const res = await fetch("/api/entreprises/sections", {
// //       method: "PUT",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ data, id }),
// //     });
// //     if (!res.ok) throw new Error("Erreur update section");
// //     if (selectedEntreprise) await refreshSections(selectedEntreprise.id);
// //   };
// //
// //   const deleteSection = async (id: number) => {
// //     const res = await fetch("/api/entreprises/sections", {
// //       method: "DELETE",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ id }),
// //     });
// //     if (!res.ok) throw new Error("Erreur delete section");
// //     if (selectedEntreprise) await refreshSections(selectedEntreprise.id);
// //   };
// //
// //   // ------------------------------
// //   // CRUD Horaires
// //   // ------------------------------
// //   const addHoraire = async (data: Partial<Horaire>): Promise<Horaire> => {
// //     const res = await fetch("/api/entreprises/horaires", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(data),
// //     });
// //     if (!res.ok) throw new Error("Erreur ajout horaire");
// //     const horaire: Horaire = await res.json();
// //     setHoraires((prev) => [...prev, horaire]);
// //     await refreshSections(selectedEntreprise?.id);
// //     return horaire;
// //   };
// //
// //   const updateHoraire = async (id: number, data: Partial<Horaire>) => {
// //     const res = await fetch("/api/entreprises/horaires", {
// //       method: "PUT",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ id, data }),
// //     });
// //     if (!res.ok) throw new Error("Erreur ajout horaire");
// //     const horaire: Horaire = await res.json();
// //     setHoraires((prev) => [...prev,horaire] );
// //     await refreshSections(selectedEntreprise?.id);
// //     // plus de "return horaire"
// //   };
// //
// //   const deleteHoraire = async (id: number) => {
// //     const res = await fetch("/api/entreprises/horaires/", {
// //       method: "DELETE",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ id }),
// //     });
// //     if (!res.ok) throw new Error("Erreur delete horaire");
// //     await refreshSections(selectedEntreprise?.id);
// //   };
// //
// //   // ------------------------------
// //   // CRUD Vacances
// //   // ------------------------------
// //   const addVacances = async (data: Partial<Vacances>): Promise<Vacances> => {
// //     const res = await fetch("/api/entreprises/vacances", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(data),
// //     });
// //     if (!res.ok) throw new Error("Erreur création vacances");
// //     const vacances: Vacances = await res.json();
// //     await refreshVacances();
// //     return vacances;
// //   };
// //
// //   const updateVacances = async (id: number, data: Partial<Vacances>) => {
// //     const res = await fetch("/api/entreprises/vacances/", {
// //       method: "PUT",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ data, id }),
// //     });
// //     if (!res.ok) throw new Error("Erreur update vacances");
// //     await refreshVacances();
// //   };
// //
// //   const deleteVacances = async (id: number) => {
// //     const res = await fetch("/api/entreprises/vacances/", {
// //       method: "DELETE",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ id }),
// //     });
// //     if (!res.ok) throw new Error("Erreur delete vacances");
// //     await refreshVacances();
// //   };
// //
// //   // ------------------------------
// //   // Helper
// //   // ------------------------------
// //   const getSectionById = (id: number) => sections.find((s) => s.id === id);
// //
// //   useEffect(() => {
// //     refreshEntreprises();
// //     refreshVacances();
// //   }, []);
// //
// //   return (
// //     <EntrepriseContext.Provider
// //       value={{
// //         entreprises,
// //         selectedEntreprise,
// //         sections,
// //         horaires,
// //         vacances,
// //         loading,
// //         refreshEntreprises,
// //         selectEntreprise,
// //         addEntreprise,
// //         updateEntreprise,
// //         deleteEntreprise,
// //         addSection,
// //         updateSection,
// //         deleteSection,
// //         addHoraire,
// //         updateHoraire,
// //         deleteHoraire,
// //         addVacances,
// //         updateVacances,
// //         deleteVacances,
// //         getSectionById,
// //       }}
// //     >
// //       {children}
// //     </EntrepriseContext.Provider>
// //   );
// // }
// //
// // export default EntrepriseProvider;
// //
// // export function useEntreprises() {
// //   const context = useContext(EntrepriseContext);
// //   if (!context)
// //     throw new Error("useEntreprises doit être utilisé à l’intérieur d’un EntrepriseProvider");
// //   return context;
// // }
//
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
// import { Entreprise, Section, Horaire, Vacances } from "@/types/entreprise";
//
// export interface EntrepriseContextType {
//   entreprises: Entreprise[];
//   selectedEntreprise: Entreprise | null;
//   sections: Section[];
//   horaires: Horaire[];
//   vacances: Vacances[];
//   loading: boolean;
//   section?: Section;
//   entrepriseId?: number;
//
//   refreshEntreprises: () => Promise<void>;
//   selectEntreprise: (entreprise: Entreprise | null) => void;
//
//   addEntreprise: (data: Partial<Entreprise>) => Promise<void>;
//   updateEntreprise: (id: number, data: Partial<Entreprise>) => Promise<void>;
//   deleteEntreprise: (id: number) => Promise<void>;
//
//   addSection: (data: Partial<Section>) => Promise<Section>;
//   updateSection: (id: number, data: Partial<Section>) => Promise<void>;
//   deleteSection: (id: number) => Promise<void>;
//
//   addHoraire: (data: Partial<Horaire>) => Promise<Horaire>;
//   updateHoraire: (id: number, data: Partial<Horaire>) => Promise<void>;
//   deleteHoraire: (id: number) => Promise<void>;
//
//   addVacances: (data: Partial<Vacances>) => Promise<Vacances>;
//   updateVacances: (id: number, data: Partial<Vacances>) => Promise<void>;
//   deleteVacances: (id: number) => Promise<void>;
//
//   getSectionById: (id: number) => Section | undefined;
// }
//
// const EntrepriseContext = createContext<EntrepriseContextType | undefined>(undefined);
//
// export function EntrepriseProvider({ children }: { children: ReactNode }) {
//   const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
//   const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
//   const [sections, setSections] = useState<Section[]>([]);
//   const [horaires, setHoraires] = useState<Horaire[]>([]);
//   const [vacances, setVacances] = useState<Vacances[]>([]);
//   const [loading, setLoading] = useState(true);
//
//   // ------------------------------
//   // ENTREPRISES
//   // ------------------------------
//   const refreshEntreprises = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/entreprises");
//       const data: Entreprise[] = await res.json();
//       setEntreprises(data);
//
//       if (!selectedEntreprise && data.length > 0) {
//         setSelectedEntreprise(data[0]);
//       }
//     } catch (err) {
//       console.error("Erreur lors du chargement des entreprises", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedEntreprise]);
//
//   const selectEntreprise = useCallback((entreprise: Entreprise | null) => {
//     setSelectedEntreprise(entreprise);
//   }, []);
//
//   const addEntreprise = useCallback(
//     async (data: Partial<Entreprise>) => {
//       const res = await fetch("/api/entreprises", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!res.ok) throw new Error("Erreur création entreprise");
//       await refreshEntreprises();
//     },
//     [refreshEntreprises],
//   );
//
//   const updateEntreprise = useCallback(
//     async (id: number, data: Partial<Entreprise>) => {
//       const res = await fetch("/api/entreprises", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, data }),
//       });
//       if (!res.ok) throw new Error("Erreur update entreprise");
//       await refreshEntreprises();
//     },
//     [refreshEntreprises],
//   );
//
//   const deleteEntreprise = useCallback(
//     async (id: number) => {
//       const res = await fetch("/api/entreprises", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       if (!res.ok) throw new Error("Erreur delete entreprise");
//       await refreshEntreprises();
//     },
//     [refreshEntreprises],
//   );
//
//   // ------------------------------
//   // SECTIONS
//   // ------------------------------
//   const refreshSections = useCallback(async (entrepriseId?: number) => {
//     if (!entrepriseId) return setSections([]);
//     try {
//       const res = await fetch(`/api/entreprises/sections?entrepriseId=${entrepriseId}`);
//       const data: Section[] = await res.json();
//       setSections(data);
//     } catch (err) {
//       console.error("Erreur lors du chargement des sections", err);
//       setSections([]);
//     }
//   }, []);
//
//   const addSection = useCallback(async (data: Partial<Section>) => {
//     const res = await fetch("/api/entreprises/sections", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error("Erreur création section");
//     const newSection: Section = await res.json();
//     setSections((prev) => [...prev, newSection]);
//     return newSection;
//   }, []);
//
//   const updateSection = useCallback(async (id: number, data: Partial<Section>) => {
//     const res = await fetch("/api/entreprises/sections", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id, data }),
//     });
//     if (!res.ok) throw new Error("Erreur update section");
//
//     setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
//   }, []);
//
//   const deleteSection = useCallback(async (id: number) => {
//     const res = await fetch("/api/entreprises/sections", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     if (!res.ok) throw new Error("Erreur suppression section");
//     setSections((prev) => prev.filter((s) => s.id !== id));
//   }, []);
//
//   // ------------------------------
//   // HORAIRES
//   // ------------------------------
//
//   const refreshHoraires = useCallback(async () => {
//     try {
//       const res = await fetch("/api/entreprises/horaires");
//       const data: Horaire[] = await res.json();
//       setHoraires(data);
//     } catch (err) {
//       console.error("Erreur lors du chargement des horaires", err);
//       setHoraires([]);
//     }
//   }, []);
//
//   const addHoraire = useCallback(async (data: Partial<Horaire>) => {
//     const res = await fetch("/api/entreprises/horaires", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error("Erreur ajout horaire");
//     const newHoraire: Horaire = await res.json();
//     setHoraires((prev) => [...prev, newHoraire]);
//     return newHoraire;
//   }, []);
//
//   const updateHoraire = useCallback(async (id: number, data: Partial<Horaire>) => {
//     const res = await fetch("/api/entreprises/horaires", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id, data }),
//     });
//     if (!res.ok) throw new Error("Erreur update horaire");
//     setHoraires((prev) => prev.map((h) => (h.id === id ? { ...h, ...data } : h)));
//   }, []);
//
//   const deleteHoraire = useCallback(async (id: number) => {
//     const res = await fetch("/api/entreprises/horaires", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     if (!res.ok) throw new Error("Erreur suppression horaire");
//     setHoraires((prev) => prev.filter((h) => h.id !== id));
//   }, []);
//
//   // ------------------------------
//   // VACANCES
//   // ------------------------------
//   const refreshVacances = useCallback(async () => {
//     try {
//       const res = await fetch("/api/entreprises/vacances");
//       const data: Vacances[] = await res.json();
//       setVacances(data);
//     } catch (err) {
//       console.error("Erreur lors du chargement des vacances", err);
//       setVacances([]);
//     }
//   }, []);
//
//   const addVacances = useCallback(async (data: Partial<Vacances>) => {
//     const res = await fetch("/api/entreprises/vacances", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) throw new Error("Erreur création vacances");
//     const newVacances: Vacances = await res.json();
//     setVacances((prev) => [...prev, newVacances]);
//     return newVacances;
//   }, []);
//
//   const updateVacances = useCallback(async (id: number, data: Partial<Vacances>) => {
//     const res = await fetch("/api/entreprises/vacances", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id, data }),
//     });
//     if (!res.ok) throw new Error("Erreur update vacances");
//     setVacances((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)));
//   }, []);
//
//   const deleteVacances = useCallback(async (id: number) => {
//     const res = await fetch("/api/entreprises/vacances", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });
//     if (!res.ok) throw new Error("Erreur suppression vacances");
//     setVacances((prev) => prev.filter((v) => v.id !== id));
//   }, []);
//
//   const getSectionById = useCallback((id: number) => sections.find((s) => s.id === id), [sections]);
//
//   // ------------------------------
//   // INITIALISATION
//   // ------------------------------
//   useEffect(() => {
//     refreshEntreprises();
//     refreshVacances();
//     refreshSections();
//     refreshHoraires();
//   }, [refreshEntreprises, refreshSections, refreshVacances, refreshHoraires]);
//
//   useEffect(() => {
//     if (selectedEntreprise) refreshSections(selectedEntreprise.id);
//   }, [selectedEntreprise, refreshSections]);
//
//   return (
//     <EntrepriseContext.Provider
//       value={{
//         entreprises,
//         selectedEntreprise,
//         sections,
//         horaires,
//         vacances,
//         loading,
//         refreshEntreprises,
//         selectEntreprise,
//         addEntreprise,
//         updateEntreprise,
//         deleteEntreprise,
//         addSection,
//         updateSection,
//         deleteSection,
//         addHoraire,
//         updateHoraire,
//         deleteHoraire,
//         addVacances,
//         updateVacances,
//         deleteVacances,
//         getSectionById,
//       }}
//     >
//       {children}
//     </EntrepriseContext.Provider>
//   );
// }
//
// export function useEntreprises() {
//   const context = useContext(EntrepriseContext);
//   if (!context)
//     throw new Error("useEntreprises doit être utilisé à l’intérieur d’un EntrepriseProvider");
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
import { Entreprise, Section, Horaire, Vacances } from "@/types/entreprise";

interface EntrepriseContextType {
    entreprises: Entreprise[];
    selectedEntreprise: Entreprise | null;
    sections: Section[];
    horaires: Horaire[];
    vacances: Vacances[];
    loading: boolean;

    selectEntreprise: (e: Entreprise | null) => void;

    addEntreprise: (data: Partial<Entreprise>) => Promise<Entreprise>;
    updateEntreprise: (id: number, data: Partial<Entreprise>) => Promise<Entreprise>;
    deleteEntreprise: (id: number) => Promise<void>;

    addSection: (data: Partial<Section>) => Promise<Section>;
    updateSection: (id: number, data: Partial<Section>) => Promise<Section>;
    deleteSection: (id: number) => Promise<void>;

    addHoraire: (data: Partial<Horaire>) => Promise<Horaire>;
    updateHoraire: (id: number, data: Partial<Horaire>) => Promise<Horaire>;
    deleteHoraire: (id: number) => Promise<void>;

    addVacances: (data: Partial<Vacances>) => Promise<Vacances>;
    updateVacances: (id: number, data: Partial<Vacances>) => Promise<Vacances>;
    deleteVacances: (id: number) => Promise<void>;
}

const EntrepriseContext = createContext<EntrepriseContextType | undefined>(undefined);

export function EntrepriseProvider({ children }: { children: ReactNode }) {
    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
    const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [horaires, setHoraires] = useState<Horaire[]>([]);
    const [vacances, setVacances] = useState<Vacances[]>([]);
    const [loading, setLoading] = useState(true);

    // ---------------------------------
    // 🔄 INIT
    // ---------------------------------
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await api<Entreprise[]>("/api/entreprises");
                setEntreprises(data);
                if (data.length > 0) setSelectedEntreprise(data[0]);
                const [sections, horaires, vacances] = await Promise.all([
                    api<Section[]>("/api/entreprises/sections"),
                    api<Horaire[]>("/api/entreprises/horaires"),
                    api<Vacances[]>("/api/entreprises/vacances"),
                ]);
                setSections(sections);
                setHoraires(horaires);
                setVacances(vacances);
            } catch (err) {
                toast.error("Erreur lors du chargement initial");
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const selectEntreprise = useCallback((e: Entreprise | null) => {
        setSelectedEntreprise(e);
    }, []);

    // ---------------------------------
    // 🏢 ENTREPRISES
    // ---------------------------------
    const addEntreprise = useCallback(async (data: Partial<Entreprise>) => {
        const entreprise = await api<Entreprise>("/api/entreprises", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setEntreprises((prev) => [...prev, entreprise]);
        toast.success("Entreprise ajoutée");
        return entreprise;
    }, []);

    const updateEntreprise = useCallback(async (id: number, data: Partial<Entreprise>) => {
        const updated = await api<Entreprise>("/api/entreprises", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, data }),
        });
        setEntreprises((prev) => prev.map((e) => (e.id === id ? updated : e)));
        toast.success("Entreprise mise à jour");
        return updated;
    }, []);

    const deleteEntreprise = useCallback(async (id: number) => {
        await api("/api/entreprises", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        setEntreprises((prev) => prev.filter((e) => e.id !== id));
        toast.success("Entreprise supprimée");
    }, []);

    // ---------------------------------
    // 🧩 SECTIONS
    // ---------------------------------
    const addSection = useCallback(async (data: Partial<Section>) => {
        const section = await api<Section>("/api/entreprises/sections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setSections((prev) => [...prev, section]);
        toast.success("Section ajoutée");
        return section;
    }, []);

    const updateSection = useCallback(async (id: number, data: Partial<Section>) => {
        const updated = await api<Section>("/api/entreprises/sections", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, data }),
        });
        setSections((prev) => prev.map((s) => (s.id === id ? updated : s)));
        toast.success("Section mise à jour");
        return updated;
    }, []);

    const deleteSection = useCallback(async (id: number) => {
        await api("/api/entreprises/sections", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        setSections((prev) => prev.filter((s) => s.id !== id));
        toast.success("Section supprimée");
    }, []);

    // ---------------------------------
    // ⏰ HORAIRES
    // ---------------------------------
    const addHoraire = useCallback(async (data: Partial<Horaire>) => {
        const horaire = await api<Horaire>("/api/entreprises/horaires", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setHoraires((prev) => [...prev, horaire]);
        toast.success("Horaire ajouté");
        return horaire;
    }, []);

    const updateHoraire = useCallback(async (id: number, data: Partial<Horaire>) => {
        const updated = await api<Horaire>("/api/entreprises/horaires", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, data }),
        });
        setHoraires((prev) => prev.map((h) => (h.id === id ? updated : h)));
        toast.success("Horaire mis à jour");
        return updated;
    }, []);

    const deleteHoraire = useCallback(async (id: number) => {
        await api("/api/entreprises/horaires", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        setHoraires((prev) => prev.filter((h) => h.id !== id));
        toast.success("Horaire supprimé");
    }, []);

    // ---------------------------------
    // 🌴 VACANCES
    // ---------------------------------
    const addVacances = useCallback(async (data: Partial<Vacances>) => {
        const vacances = await api<Vacances>("/api/entreprises/vacances", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setVacances((prev) => [...prev, vacances]);
        toast.success("Vacances ajoutées");
        return vacances;
    }, []);

    const updateVacances = useCallback(async (id: number, data: Partial<Vacances>) => {
        const updated = await api<Vacances>("/api/entreprises/vacances", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, data }),
        });
        setVacances((prev) => prev.map((v) => (v.id === id ? updated : v)));
        toast.success("Vacances mises à jour");
        return updated;
    }, []);

    const deleteVacances = useCallback(async (id: number) => {
        await api("/api/entreprises/vacances", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        setVacances((prev) => prev.filter((v) => v.id !== id));
        toast.success("Vacances supprimées");
    }, []);

    // ---------------------------------
    // 🧩 RENDER
    // ---------------------------------
    return (
        <EntrepriseContext.Provider
            value={{
                entreprises,
                selectedEntreprise,
                sections,
                horaires,
                vacances,
                loading,
                selectEntreprise,
                addEntreprise,
                updateEntreprise,
                deleteEntreprise,
                addSection,
                updateSection,
                deleteSection,
                addHoraire,
                updateHoraire,
                deleteHoraire,
                addVacances,
                updateVacances,
                deleteVacances,
            }}
        >
            {children}
        </EntrepriseContext.Provider>
    );
}

export function useEntreprises() {
    const context = useContext(EntrepriseContext);
    if (!context) throw new Error("useEntreprises doit être utilisé à l’intérieur d’un EntrepriseProvider");
    return context;
}
