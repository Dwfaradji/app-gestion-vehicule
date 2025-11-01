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
import type { Utilisateur } from "@/types/utilisateur";

interface UtilisateursContextProps {
  utilisateurs: Utilisateur[];
  loading: boolean;

  addUtilisateur: (u: Partial<Utilisateur>) => Promise<Utilisateur | null>;
  updateUtilisateur: (u: Utilisateur) => Promise<Utilisateur | null>;
  deleteUtilisateur: (id: number) => Promise<void>;
  updatePassword: (params: { id: number; actuel: string; nouveau: string }) => Promise<void>;
}

const UtilisateursContext = createContext<UtilisateursContextProps | undefined>(undefined);

export const UtilisateursProvider = ({ children }: { children: ReactNode }) => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // 🔄 INIT
  // -------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api<Utilisateur[]>("/api/utilisateurs");
        setUtilisateurs(data);
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------------------
  // 👤 CRUD UTILISATEURS
  // -------------------------------
  const addUtilisateur = useCallback(async (u: Partial<Utilisateur>) => {
    try {
      const created = await api<Utilisateur>("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u),
      });
      setUtilisateurs((prev) => [...prev, created]);
      toast.success("Utilisateur ajouté !");
      return created;
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout de l'utilisateur");
      return null;
    }
  }, []);

  const updateUtilisateur = useCallback(async (u: Utilisateur) => {
    try {
      const updated = await api<Utilisateur>("/api/utilisateurs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u),
      });
      setUtilisateurs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      toast.success("Utilisateur mis à jour !");
      return updated;
    } catch (err) {
      console.error(err);
      toast.error("Erreur mise à jour utilisateur");
      return null;
    }
  }, []);

  const deleteUtilisateur = useCallback(async (id: number) => {
    try {
      await api("/api/utilisateurs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setUtilisateurs((prev) => prev.filter((x) => x.id !== id));
      toast.success("Utilisateur supprimé !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur suppression utilisateur");
    }
  }, []);

  const updatePassword = useCallback(
    async ({ id, actuel, nouveau }: { id: number; actuel: string; nouveau: string }) => {
      try {
        const res = await api("/api/utilisateurs/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, actuel, nouveau }),
        });
        if (!res) throw new Error("Impossible de mettre à jour le mot de passe");
        toast.success("Mot de passe mis à jour !");
      } catch (err) {
        console.error(err);
        toast.error("Erreur mise à jour mot de passe");
      }
    },
    [],
  );

  return (
    <UtilisateursContext.Provider
      value={{
        utilisateurs,
        loading,
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
  if (!context)
    throw new Error("useUtilisateurs doit être utilisé à l’intérieur d’un UtilisateursProvider");
  return context;
};
