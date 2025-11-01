"use client";

import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { ParametreEntretien } from "@/types/entretien";

interface ParametresEntretienContextType {
  parametresEntretien: ParametreEntretien[];
  loading: boolean;

  addParametreEntretien: (p: Partial<ParametreEntretien>) => Promise<ParametreEntretien>;
  updateParametreEntretien: (p: ParametreEntretien) => Promise<ParametreEntretien>;
  deleteParametreEntretien: (id: number) => Promise<void>;
  resetParametreEntretien: () => Promise<void>;
}

const ParametresEntretienContext = createContext<ParametresEntretienContextType | undefined>(
  undefined,
);

export function ParametresEntretienProvider({ children }: { children: ReactNode }) {
  const [parametresEntretien, setParametresEntretien] = useState<ParametreEntretien[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------
  // 🔄 INIT
  // ---------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api<ParametreEntretien[]>("/api/parametres-entretien");
        setParametresEntretien(data);
      } catch (err) {
        toast.error("Erreur lors du chargement des paramètres d'entretien");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------------------------------
  // 🏷 CRUD
  // ---------------------------------
  const addParametreEntretien = useCallback(async (p: Partial<ParametreEntretien>) => {
    const newParam = await api<ParametreEntretien>("/api/parametres-entretien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    setParametresEntretien((prev) => [...prev, newParam]);
    toast.success("Paramètre ajouté");
    return newParam;
  }, []);

  const updateParametreEntretien = useCallback(async (p: ParametreEntretien) => {
    const updated = await api<ParametreEntretien>("/api/parametres-entretien", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    setParametresEntretien((prev) => prev.map((param) => (param.id === p.id ? updated : param)));
    toast.success("Paramètre mis à jour");
    return updated;
  }, []);

  const deleteParametreEntretien = useCallback(async (id: number) => {
    await api("/api/parametres-entretien", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setParametresEntretien((prev) => prev.filter((param) => param.id !== id));
    toast.success("Paramètre supprimé");
  }, []);

  const resetParametreEntretien = useCallback(async () => {
    setLoading(true);
    const newParam = await api<{ entretien: ParametreEntretien[] }>(
      "/api/parametres-entretien/reset",
      {
        method: "POST",
      },
    );
    toast.success("Paramètre réinitialisés avec succès !");
    setLoading(false);
    return newParam;
  }, []);
  // ---------------------------------
  // 🧩 RENDER
  // ---------------------------------
  return (
    <ParametresEntretienContext.Provider
      value={{
        parametresEntretien,
        loading,
        addParametreEntretien,
        updateParametreEntretien,
        deleteParametreEntretien,
        resetParametreEntretien,
      }}
    >
      {children}
    </ParametresEntretienContext.Provider>
  );
}

export function useParametresEntretien() {
  const context = useContext(ParametresEntretienContext);
  if (!context)
    throw new Error(
      "useParametresEntretien doit être utilisé à l’intérieur d’un ParametresEntretienProvider",
    );
  return context;
}
