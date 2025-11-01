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
import type { Vehicule } from "@/types/vehicule";

interface VehiculesContextProps {
  vehicules: Vehicule[];
  loading: boolean;

  addVehicule: (v: Partial<Vehicule>) => Promise<Vehicule>;
  updateVehicule: (v: Partial<Vehicule> & { id: number }) => Promise<Vehicule>;
  deleteVehicule: (id: number) => Promise<void>;
}

const VehiculesContext = createContext<VehiculesContextProps | undefined>(undefined);

export const VehiculesProvider = ({ children }: { children: ReactNode }) => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // 🔄 INIT
  // ------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api<Vehicule[]>("/api/vehicules");
        setVehicules(data);
      } catch (err) {
        toast.error("Erreur lors du chargement des véhicules");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------------------------------
  // CRUD VEHICULES
  // ------------------------------
  const addVehicule = useCallback(async (v: Partial<Vehicule>) => {
    const vehicule = await api<Vehicule>("/api/vehicules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    setVehicules((prev) => [...prev, vehicule]);
    toast.success("Véhicule ajouté");
    return vehicule;
  }, []);

  const updateVehicule = useCallback(async (v: Partial<Vehicule> & { id: number }) => {
    const updated = await api<Vehicule>("/api/vehicules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    setVehicules((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    toast.success("Véhicule mis à jour");
    return updated;
  }, []);

  const deleteVehicule = useCallback(async (id: number) => {
    await api("/api/vehicules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setVehicules((prev) => prev.filter((x) => x.id !== id));
    toast.success("Véhicule supprimé");
  }, []);

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <VehiculesContext.Provider
      value={{
        vehicules,
        loading,
        addVehicule,
        updateVehicule,
        deleteVehicule,
      }}
    >
      {children}
    </VehiculesContext.Provider>
  );
};

export const useVehicules = () => {
  const context = useContext(VehiculesContext);
  if (!context)
    throw new Error("useVehicules must be utilisé à l’intérieur d’un VehiculesProvider");
  return context;
};
