"use client";
import { createContext, useContext, ReactNode, useCallback, useState } from "react";
import { Depense } from "@/types/depenses";

interface DepensesContextProps {
    depenses: Depense[];
    loading: boolean; // ✅ état de chargement
    refreshDepenses: (vehiculeId: number) => Promise<void>;
    addDepense: (d: Partial<Depense>) => Promise<void>;
    deleteDepense: (id: number, vehiculeId: number) => Promise<void>;
}

const DepensesContext = createContext<DepensesContextProps | undefined>(undefined);

export const DepensesProvider = ({ children }: { children: ReactNode }) => {
    const [depenses, setDepenses] = useState<Depense[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshDepenses = useCallback(async (vehiculeId: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/depenses?vehiculeId=${vehiculeId}`);
            const data: Depense[] = await res.json();
            setDepenses(data);
        } finally {
            setLoading(false);
        }
    }, []);

    const addDepense = useCallback(async (d: Partial<Depense>) => {
        if (!d.vehiculeId) return;
        setLoading(true);
        try {
            const res = await fetch("/api/depenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(d),
            });
            if (res.ok) await refreshDepenses(d.vehiculeId);
        } finally {
            setLoading(false);
        }
    }, [refreshDepenses]);

    const deleteDepense = useCallback(async (id: number, vehiculeId: number) => {
        setLoading(true);
        try {
            const res = await fetch("/api/depenses", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, vehiculeId }),
            });
            if (res.ok) await refreshDepenses(vehiculeId);
        } finally {
            setLoading(false);
        }
    }, [refreshDepenses]);

    return (
        <DepensesContext.Provider value={{ depenses, loading, refreshDepenses, addDepense, deleteDepense }}>
            {children}
        </DepensesContext.Provider>
    );
};

export const useDepenses = () => {
    const context = useContext(DepensesContext);
    if (!context) throw new Error("useDepenses must be used within DepensesProvider");
    return context;
};