"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useCallback, useState, useEffect } from "react";
import type { Vehicule } from "@/types/vehicule";

interface VehiculesContextProps {
  vehicules: Vehicule[];
  loading: boolean; // ✅ ajout du loading
  refreshVehicules: () => Promise<void>;
  addVehicule: (v: Partial<Vehicule>) => Promise<Vehicule | null>;
  updateVehicule: (v: Partial<Vehicule> & { id: number }) => Promise<Vehicule | null>;
  deleteVehicule: (id: number) => Promise<boolean>;
}

const VehiculesContext = createContext<VehiculesContextProps | undefined>(undefined);

export const VehiculesProvider = ({ children }: { children: ReactNode }) => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true); // ✅ initialisation du loading

  // GET (rafraîchir)
  const refreshVehicules = useCallback(async () => {
    setLoading(true); // ✅ start loading
    try {
      const res = await fetch("/api/vehicules");
      if (!res.ok) throw new Error("Erreur fetch vehicules");
      const data: Vehicule[] = await res.json();
      setVehicules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  }, []);

  // POST
  const addVehicule = useCallback(async (v: Partial<Vehicule>) => {
    const res = await fetch("/api/vehicules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    if (res.ok) {
      const saved: Vehicule = await res.json();
      setVehicules((prev) => [...prev, saved]);
      return saved;
    }
    return null;
  }, []);

  // PUT
  const updateVehicule = useCallback(async (v: Partial<Vehicule> & { id: number }) => {
    const res = await fetch("/api/vehicules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    if (res.ok) {
      const updated: Vehicule = await res.json();
      setVehicules((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      return updated;
    }
    return null;
  }, []);

  // DELETE
  const deleteVehicule = useCallback(async (id: number) => {
    const res = await fetch("/api/vehicules", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setVehicules((prev) => prev.filter((x) => x.id !== id));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    refreshVehicules();
  }, [refreshVehicules]);

  return (
    <VehiculesContext.Provider
      value={{ vehicules, loading, refreshVehicules, addVehicule, updateVehicule, deleteVehicule }}
    >
      {children}
    </VehiculesContext.Provider>
  );
};

export const useVehicules = () => {
  const context = useContext(VehiculesContext);
  if (!context) throw new Error("useVehicules must be used within VehiculesProvider");
  return context;
};
