"use client";
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from "react";
import { Vehicule } from "@/types/vehicule";

interface VehiculesContextProps {
    vehicules: Vehicule[];
    refreshVehicules: () => Promise<void>;
    addVehicule: (v: Partial<Vehicule>) => Promise<void>;
    updateVehicule: (v: Partial<Vehicule> & { id: number }) => Promise<void>;
    deleteVehicule: (id: number) => Promise<void>;
}

const VehiculesContext = createContext<VehiculesContextProps | undefined>(undefined);

export const VehiculesProvider = ({ children }: { children: ReactNode }) => {
    const [vehicules, setVehicules] = useState<Vehicule[]>([]);

    const refreshVehicules = useCallback(async () => {
        const res = await fetch("/api/vehicules");
        const data: Vehicule[] = await res.json();
        setVehicules(data);
    }, []);

    const addVehicule = useCallback(async (v: Partial<Vehicule>) => {
        const res = await fetch("/api/vehicules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(v),
        });
        if (res.ok) await refreshVehicules();
    }, [refreshVehicules]);

    const updateVehicule = useCallback(async (v: Partial<Vehicule> & { id: number }) => {
        const { id, ...data } = v;
        const res = await fetch("/api/vehicules", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) await refreshVehicules();
    }, [refreshVehicules]);

    const deleteVehicule = useCallback(async (id: number) => {
        const res = await fetch("/api/vehicules", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshVehicules();
    }, [refreshVehicules]);

    useEffect(() => {
        refreshVehicules();
    }, [refreshVehicules]);

    return (
        <VehiculesContext.Provider value={{ vehicules, refreshVehicules, addVehicule, updateVehicule, deleteVehicule }}>
            {children}
        </VehiculesContext.Provider>
    );
};

export const useVehicules = () => {
    const context = useContext(VehiculesContext);
    if (!context) throw new Error("useVehicules must be used within VehiculesProvider");
    return context;
};