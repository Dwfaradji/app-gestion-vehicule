"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { Vehicule } from "@/types/vehicule";
import { Utilisateur } from "@/types/utilisateur";
import { ParametreEntretien } from "@/types/entretien";
import { Depense } from "@/types/depenses";

interface DataContextProps {
    vehicules: Vehicule[];
    refreshVehicules: () => Promise<void>;
    addVehicule: (v: Partial<Vehicule>) => Promise<void>;
    updateVehicule: (v: Partial<Vehicule> & { id: number }) => Promise<void>;
    deleteVehicule: (id: number) => Promise<void>;

    emails: string[];
    refreshEmails: () => Promise<void>;
    addEmail: (email: string) => Promise<void>;
    updateEmail: (id: number, email: string) => Promise<void>;
    deleteEmail: (id: number) => Promise<void>;

    utilisateurs: Utilisateur[];
    refreshUtilisateurs: () => Promise<void>;
    addUtilisateur: (u: Partial<Utilisateur>) => Promise<void>;
    updateUtilisateur: (u: Utilisateur) => Promise<void>;
    deleteUtilisateur: (id: number) => Promise<void>;

    parametresEntretien: ParametreEntretien[];
    refreshParametresEntretien: () => Promise<void>;
    addParametreEntretien: (p: Partial<ParametreEntretien>) => Promise<void>;
    updateParametreEntretien: (p: ParametreEntretien) => Promise<void>;
    deleteParametreEntretien: (id: number) => Promise<void>;

    depenses: Depense[];
    refreshDepenses: (vehiculeId: number) => Promise<void>;
    addDepense: (d: Partial<Depense>) => Promise<void>;
    deleteDepense: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [vehicules, setVehicules] = useState<Vehicule[]>([]);
    const [emails, setEmails] = useState<string[]>([]);
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [parametresEntretien, setParametresEntretien] = useState<ParametreEntretien[]>([]);
    const [depenses, setDepenses] = useState<Depense[]>([]);

    // ===== VEHICULES =====
    const refreshVehicules = useCallback(async () => {
        const res = await fetch("/api/vehicules");
        const data = await res.json();
        setVehicules(data);
    }, []);

    const addVehicule = useCallback(async (v: Partial<Vehicule>) => {
        const requiredFields: (keyof Vehicule)[] = [
            "type","modele","km","annee","energie","prixAchat","dateEntretien",
            "statut","prochaineRevision","immat","ctValidite"
        ];
        const missing = requiredFields.filter(f => !v[f]);
        if (missing.length) {
            console.warn("Champs manquants pour le véhicule :", missing);
            return;
        }
        const res = await fetch("/api/vehicules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(v),
        });
        if (res.ok) await refreshVehicules();
    }, [refreshVehicules]);

    const updateVehicule = useCallback(async (v: Partial<Vehicule> & { id: number }) => {
        try {
            const { id, ...data } = v;
            const filteredData: Record<string, any> = {};
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) filteredData[key] = value;
            });

            if (filteredData.dateEntretien) filteredData.dateEntretien = new Date(filteredData.dateEntretien);
            if (filteredData.prochaineRevision) filteredData.prochaineRevision = new Date(filteredData.prochaineRevision);
            if (filteredData.ctValidite) filteredData.ctValidite = new Date(filteredData.ctValidite);

            const res = await fetch("/api/vehicules", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...filteredData }),
            });

            if (res.ok) await refreshVehicules();
            else console.error("Erreur updateVehicule:", await res.json());
        } catch (err) {
            console.error("Erreur updateVehicule:", err);
        }
    }, [refreshVehicules]);

    const deleteVehicule = useCallback(async (id: number) => {
        const res = await fetch("/api/vehicules", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshVehicules();
    }, [refreshVehicules]);

    // ===== EMAILS =====
    const refreshEmails = useCallback(async () => {
        const res = await fetch("/api/emails");
        const data = await res.json();
        setEmails(data);
    }, []);

    const addEmail = useCallback(async (email: string) => {
        if (!email) return console.warn("Email vide !");
        const res = await fetch("/api/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (res.ok) await refreshEmails();
    }, [refreshEmails]);

    const updateEmail = useCallback(async (id: number, email: string) => {
        if (!email) return console.warn("Email vide !");
        const res = await fetch("/api/emails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, email }),
        });
        if (res.ok) await refreshEmails();
    }, [refreshEmails]);

    const deleteEmail = useCallback(async (id: number) => {
        const res = await fetch("/api/emails", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshEmails();
    }, [refreshEmails]);

    // ===== UTILISATEURS =====
    const refreshUtilisateurs = useCallback(async () => {
        const res = await fetch("/api/utilisateurs");
        const data = await res.json();
        setUtilisateurs(data);
    }, []);

    const addUtilisateur = useCallback(async (u: Partial<Utilisateur>) => {
        if (!u.name || !u.fonction) return console.warn("Nom ou fonction manquante !");
        const res = await fetch("/api/utilisateurs", {
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

    // ===== PARAMETRES ENTRETIEN =====
    const refreshParametresEntretien = useCallback(async () => {
        const res = await fetch("/api/parametres-entretien");
        const data = await res.json();
        setParametresEntretien(data);
    }, []);

    const addParametreEntretien = useCallback(async (p: Partial<ParametreEntretien>) => {
        if (!p.type) return console.warn("Type manquant !");
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

    // ===== DEPENSES =====
    const refreshDepenses = useCallback(async (vehiculeId: number) => {
        const res = await fetch(`/api/depenses?vehiculeId=${vehiculeId}`);
        const data = await res.json();
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

    const deleteDepense = async (id: number, vehiculeId: number) => {
        const res = await fetch("/api/depenses", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            await refreshDepenses(vehiculeId);
        } else {
            console.error("Erreur deleteDepense", await res.json());
        }
    };

    // ===== Initial load =====
    useEffect(() => {
        refreshVehicules();
        refreshUtilisateurs();
        refreshParametresEntretien();
    }, [refreshVehicules, refreshUtilisateurs, refreshParametresEntretien]);

    return (
        <DataContext.Provider value={{
            vehicules, refreshVehicules, addVehicule, updateVehicule, deleteVehicule,
            emails, refreshEmails, addEmail, updateEmail, deleteEmail,
            utilisateurs, refreshUtilisateurs, addUtilisateur, updateUtilisateur, deleteUtilisateur,
            parametresEntretien, refreshParametresEntretien, addParametreEntretien, updateParametreEntretien, deleteParametreEntretien,
            depenses, refreshDepenses, addDepense, deleteDepense
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within a DataProvider");
    return context;
};