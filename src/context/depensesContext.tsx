"use client";

import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Depense } from "@/types/depenses";

export interface DepensesContextType {
  depenses: Depense[];
  loading: boolean;

  addDepense: (d: Partial<Depense>) => Promise<Depense>;
  updateDepense: (id: number, d: Partial<Depense>) => Promise<Depense>;
  deleteDepense: (id: number) => Promise<void>;
}

const DepensesContext = createContext<DepensesContextType | undefined>(undefined);

export function DepensesProvider({ children }: { children: ReactNode }) {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------
  // 🔄 INIT
  // ---------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api<Depense[]>("/api/depenses");
        setDepenses(data);
      } catch (err) {
        toast.error("Erreur lors du chargement des dépenses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------------------------------
  // 🏷 CRUD
  // ---------------------------------
  const addDepense = useCallback(async (d: Partial<Depense>) => {
    const newDepense = await api<Depense>("/api/depenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    });
    setDepenses((prev) => [...prev, newDepense]);
    toast.success("Dépense ajoutée");
    return newDepense;
  }, []);

  const updateDepense = useCallback(async (id: number, d: Partial<Depense>) => {
    const updated = await api<Depense>("/api/depenses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...d }),
    });
    setDepenses((prev) => prev.map((dep) => (dep.id === id ? updated : dep)));
    toast.success("Dépense mise à jour");
    return updated;
  }, []);

  const deleteDepense = useCallback(async (id: number) => {
    await api("/api/depenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDepenses((prev) => prev.filter((dep) => dep.id !== id));
    toast.success("Dépense supprimée");
  }, []);

  // ---------------------------------
  // 🧩 RENDER
  // ---------------------------------
  return (
    <DepensesContext.Provider
      value={{ depenses, loading, addDepense, updateDepense, deleteDepense }}
    >
      {children}
    </DepensesContext.Provider>
  );
}

export function useDepenses() {
  const context = useContext(DepensesContext);
  if (!context)
    throw new Error("useDepenses doit être utilisé à l’intérieur d’un DepensesProvider");
  return context;
}
