"use client";
import type { ReactNode } from "react";
import { createContext, useContext, useCallback, useState, useEffect } from "react";
import type { ParametreEntretien } from "@/types/entretien";

interface ParametresEntretienContextProps {
  parametresEntretien: ParametreEntretien[];
  loading: boolean; // ✅ loading global
  refreshParametresEntretien: () => Promise<void>;
  addParametreEntretien: (p: Partial<ParametreEntretien>) => Promise<void>;
  updateParametreEntretien: (p: ParametreEntretien) => Promise<void>;
  deleteParametreEntretien: (id: number) => Promise<void>;
}

const ParametresEntretienContext = createContext<ParametresEntretienContextProps | undefined>(
  undefined,
);

export const ParametresEntretienProvider = ({ children }: { children: ReactNode }) => {
  const [parametresEntretien, setParametresEntretien] = useState<ParametreEntretien[]>([]);
  const [loading, setLoading] = useState(true); // ⏳ initialisation du loading

  const refreshParametresEntretien = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/parametres-entretien");
      const data: ParametreEntretien[] = await res.json();
      setParametresEntretien(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addParametreEntretien = useCallback(
    async (p: Partial<ParametreEntretien>) => {
      setLoading(true);
      try {
        const res = await fetch("/api/parametres-entretien", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
        if (res.ok) await refreshParametresEntretien();
      } finally {
        setLoading(false);
      }
    },
    [refreshParametresEntretien],
  );

  const updateParametreEntretien = useCallback(
    async (p: ParametreEntretien) => {
      setLoading(true);
      try {
        const res = await fetch("/api/parametres-entretien", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        });
        if (res.ok) await refreshParametresEntretien();
      } finally {
        setLoading(false);
      }
    },
    [refreshParametresEntretien],
  );

  const deleteParametreEntretien = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        const res = await fetch("/api/parametres-entretien", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshParametresEntretien();
      } finally {
        setLoading(false);
      }
    },
    [refreshParametresEntretien],
  );

  useEffect(() => {
    refreshParametresEntretien();
  }, [refreshParametresEntretien]);

  return (
    <ParametresEntretienContext.Provider
      value={{
        parametresEntretien,
        loading, // ✅ expose loading
        refreshParametresEntretien,
        addParametreEntretien,
        updateParametreEntretien,
        deleteParametreEntretien,
      }}
    >
      {children}
    </ParametresEntretienContext.Provider>
  );
};

export const useParametresEntretien = () => {
  const context = useContext(ParametresEntretienContext);
  if (!context)
    throw new Error("useParametresEntretien must be used within ParametresEntretienProvider");
  return context;
};
