"use client";
import type { ReactNode } from "react";
import { createContext, useContext, useCallback, useState, useEffect } from "react";
import type { Utilisateur } from "@/types/utilisateur";

interface UtilisateursContextProps {
  utilisateurs: Utilisateur[];
  loading: boolean; // ✅ nouvel état loading
  refreshUtilisateurs: () => Promise<void>;
  addUtilisateur: (u: Partial<Utilisateur>) => Promise<void>;
  updateUtilisateur: (u: Utilisateur) => Promise<void>;
  deleteUtilisateur: (id: number) => Promise<void>;
  updatePassword: ({
    id,
    actuel,
    nouveau,
  }: {
    id: number;
    actuel: string;
    nouveau: string;
  }) => Promise<void>;
}

const UtilisateursContext = createContext<UtilisateursContextProps | undefined>(undefined);

export const UtilisateursProvider = ({ children }: { children: ReactNode }) => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true); // ✅ initialisation à true

  const refreshUtilisateurs = useCallback(async () => {
    setLoading(true); // ⏳ début du chargement
    try {
      const res = await fetch("/api/utilisateurs");
      const data: Utilisateur[] = await res.json();
      setUtilisateurs(data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs", err);
    } finally {
      setLoading(false); // ✅ fin du chargement
    }
  }, []);

  const addUtilisateur = useCallback(
    async (u: Partial<Utilisateur>) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(u),
        });
        if (res.ok) await refreshUtilisateurs();
      } finally {
        setLoading(false);
      }
    },
    [refreshUtilisateurs],
  );

  const updateUtilisateur = useCallback(
    async (u: Utilisateur) => {
      setLoading(true);
      try {
        const res = await fetch("/api/utilisateurs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(u),
        });
        if (res.ok) await refreshUtilisateurs();
      } finally {
        setLoading(false);
      }
    },
    [refreshUtilisateurs],
  );

  const deleteUtilisateur = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        const res = await fetch("/api/utilisateurs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshUtilisateurs();
      } finally {
        setLoading(false);
      }
    },
    [refreshUtilisateurs],
  );

  const updatePassword = useCallback(
    async ({ id, actuel, nouveau }: { id: number; actuel: string; nouveau: string }) => {
      setLoading(true);
      try {
        const res = await fetch("/api/utilisateurs/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, actuel, nouveau }),
        });
        if (!res.ok) throw new Error("Impossible de mettre à jour le mot de passe");
        await refreshUtilisateurs();
      } finally {
        setLoading(false);
      }
    },
    [refreshUtilisateurs],
  );

  useEffect(() => {
    refreshUtilisateurs();
  }, [refreshUtilisateurs]);

  return (
    <UtilisateursContext.Provider
      value={{
        utilisateurs,
        loading, // ✅ expose loading
        refreshUtilisateurs,
        addUtilisateur,
        updateUtilisateur,
        deleteUtilisateur,
        updatePassword,
      }}
    >
      {children}
    </UtilisateursContext.Provider>
  );
};

export const useUtilisateurs = () => {
  const context = useContext(UtilisateursContext);
  if (!context) throw new Error("useUtilisateurs must be used within UtilisateursProvider");
  return context;
};
