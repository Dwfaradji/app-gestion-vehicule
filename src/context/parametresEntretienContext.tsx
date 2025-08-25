"use client";
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from "react";
import { ParametreEntretien } from "@/types/entretien";

interface ParametresEntretienContextProps {
    parametresEntretien: ParametreEntretien[];
    refreshParametresEntretien: () => Promise<void>;
    addParametreEntretien: (p: Partial<ParametreEntretien>) => Promise<void>;
    updateParametreEntretien: (p: { id: number; type: string; seuilKm: number; alertKmBefore: number }) => Promise<void>;
    deleteParametreEntretien: (id: number) => Promise<void>;
}

const ParametresEntretienContext = createContext<ParametresEntretienContextProps | undefined>(undefined);

export const ParametresEntretienProvider = ({ children }: { children: ReactNode }) => {
    const [parametresEntretien, setParametresEntretien] = useState<ParametreEntretien[]>([]);

    const refreshParametresEntretien = useCallback(async () => {
        const res = await fetch("/api/parametres-entretien");
        const data: ParametreEntretien[] = await res.json();
        setParametresEntretien(data);
    }, []);

    const addParametreEntretien = useCallback(async (p: Partial<ParametreEntretien>) => {
        const res = await fetch("/api/parametres-entretien", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
        });
        if (res.ok) await refreshParametresEntretien();
    }, [refreshParametresEntretien]);

    const updateParametreEntretien = useCallback(async (p: ParametreEntretien) => {
        const res = await fetch("/api/parametres-entretien", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
        });
        if (res.ok) await refreshParametresEntretien();
    }, [refreshParametresEntretien]);

    const deleteParametreEntretien = useCallback(async (id: number) => {
        const res = await fetch("/api/parametres-entretien", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshParametresEntretien();
    }, [refreshParametresEntretien]);

    useEffect(() => {
        refreshParametresEntretien();
    }, [refreshParametresEntretien]);

    return (
        <ParametresEntretienContext.Provider value={{ parametresEntretien, refreshParametresEntretien, addParametreEntretien, updateParametreEntretien, deleteParametreEntretien }}>
            {children}
        </ParametresEntretienContext.Provider>
    );
};

export const useParametresEntretien = () => {
    const context = useContext(ParametresEntretienContext);
    if (!context) throw new Error("useParametresEntretien must be used within ParametresEntretienProvider");
    return context;
};