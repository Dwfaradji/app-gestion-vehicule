"use client";
import { createContext, useContext, ReactNode, useCallback, useState } from "react";
import { Depense } from "@/types/depenses";

interface DepensesContextProps {
    depenses: Depense[];
    refreshDepenses: (vehiculeId: number) => Promise<void>;
    addDepense: (d: Partial<Depense>) => Promise<void>;
    deleteDepense: (vehiculeId: number, id: number) => Promise<void>;
}

const DepensesContext = createContext<DepensesContextProps | undefined>(undefined);

export const DepensesProvider = ({ children }: { children: ReactNode }) => {
    const [depenses, setDepenses] = useState<Depense[]>([]);

    const refreshDepenses = useCallback(async (vehiculeId: number) => {
        const res = await fetch(`/api/depenses?vehiculeId=${vehiculeId}`);
        const data: Depense[] = await res.json();
        setDepenses(data);
    }, []);

    const addDepense = useCallback(async (d: Partial<Depense>) => {
        const res = await fetch("/api/depenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(d),
        });
        if (res.ok && d.vehiculeId) await refreshDepenses(d.vehiculeId);
    }, [refreshDepenses]);

    const deleteDepense = useCallback(async ( id: number, vehiculeId:number) => {
        const res = await fetch("/api/depenses", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, vehiculeId }),
        });
        if (res.ok) await refreshDepenses(vehiculeId);
    }, [refreshDepenses]);

    return (
        <DepensesContext.Provider value={{ depenses, refreshDepenses, addDepense, deleteDepense }}>
            {children}
        </DepensesContext.Provider>
    );
};

export const useDepenses = () => {
    const context = useContext(DepensesContext);
    if (!context) throw new Error("useDepenses must be used within DepensesProvider");
    return context;
};