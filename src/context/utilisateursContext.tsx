"use client";
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from "react";
import { Utilisateur } from "@/types/utilisateur";

interface UtilisateursContextProps {
    utilisateurs: Utilisateur[];
    refreshUtilisateurs: () => Promise<void>;
    addUtilisateur: (u: Partial<Utilisateur>) => Promise<void>;
    updateUtilisateur: (u: Utilisateur) => Promise<void>;
    deleteUtilisateur: (id: number) => Promise<void>;
    updatePassword: ({ id, actuel, nouveau }: { id: number; actuel: string; nouveau: string }) => Promise<void>;
}

const UtilisateursContext = createContext<UtilisateursContextProps | undefined>(undefined);

export const UtilisateursProvider = ({ children }: { children: ReactNode }) => {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);

    const refreshUtilisateurs = useCallback(async () => {
        const res = await fetch("/api/utilisateurs");
        const data: Utilisateur[] = await res.json();
        setUtilisateurs(data);
    }, []);

    const addUtilisateur = useCallback(async (u: Partial<Utilisateur>) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(u),
        });
        if (res.ok) await refreshUtilisateurs();
    }, [refreshUtilisateurs]);

    const updateUtilisateur = useCallback(async (u: Utilisateur) => {
        const res = await fetch("/api/utilisateurs", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(u),
        });
        if (res.ok) await refreshUtilisateurs();
    }, [refreshUtilisateurs]);

    const deleteUtilisateur = useCallback(async (id: number) => {
        const res = await fetch("/api/utilisateurs", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshUtilisateurs();
    }, [refreshUtilisateurs]);

    const updatePassword = useCallback(
        async ({ id, actuel, nouveau }: { id: number; actuel: string; nouveau: string }) => {
            const res = await fetch("/api/utilisateurs/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, actuel, nouveau }),
            });
            if (!res.ok) throw new Error("Impossible de mettre à jour le mot de passe");
            await refreshUtilisateurs();
        },
        [refreshUtilisateurs]
    );

    useEffect(() => {
        refreshUtilisateurs();
    }, [refreshUtilisateurs]);

    return (
        <UtilisateursContext.Provider value={{ utilisateurs, refreshUtilisateurs, addUtilisateur, updateUtilisateur, deleteUtilisateur, updatePassword }}>
            {children}
        </UtilisateursContext.Provider>
    );
};

export const useUtilisateurs = () => {
    const context = useContext(UtilisateursContext);
    if (!context) throw new Error("useUtilisateurs must be used within UtilisateursProvider");
    return context;
};