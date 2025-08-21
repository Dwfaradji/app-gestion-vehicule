"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Vehicule } from "@/types/vehicule";
import { Utilisateur } from "@/types/utilisateur";
import { ParametreEntretien } from "@/types/entretien";
import { Depense } from "@/types/depenses";

// ✅ interface unique (ne pas redéclarer plus bas)
interface DataContextProps {
    vehicules: Vehicule[];
    refreshVehicules: () => Promise<void>;
    addVehicule: (v: Partial<Vehicule>) => Promise<void>;
    updateVehicule: (v: Vehicule) => Promise<void>;
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

    // ✅ Ajout dépense ici
    depenses: Depense[];
    refreshDepenses: (vehiculeId: number) => Promise<void>;
    addDepense: (d: Partial<Depense>) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [vehicules, setVehicules] = useState<Vehicule[]>([]);
    const [emails, setEmails] = useState<string[]>([]);
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [parametresEntretien, setParametresEntretien] = useState<ParametreEntretien[]>([]);
    const [depenses, setDepenses] = useState<Depense[]>([]);

    // ===== VEHICULES =====
    const refreshVehicules = async () => {
        const res = await fetch("/api/vehicules");
        const data = await res.json();
        setVehicules(data);
    };

    const addVehicule = async (v: Partial<Vehicule>) => {
        const requiredFields: (keyof Vehicule)[] = ["type","modele","km","annee","energie","prixAchat","dateEntretien","statut","prochaineRevision","immat","ctValidite"];
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
    };

    const updateVehicule = async (v: Vehicule) => {
        const res = await fetch("/api/vehicules", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(v),
        });
        if (res.ok) await refreshVehicules();
    };

    const deleteVehicule = async (id: number) => {
        const res = await fetch("/api/vehicules", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshVehicules();
    };

    // ===== EMAILS =====
    const refreshEmails = async () => {
        const res = await fetch("/api/emails");
        const data = await res.json();
        setEmails(data);
    };

    const addEmail = async (email: string) => {
        if (!email) return console.warn("Email vide !");
        const res = await fetch("/api/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (res.ok) await refreshEmails();
    };

    const updateEmail = async (id: number, email: string) => {
        if (!email) return console.warn("Email vide !");
        const res = await fetch("/api/emails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, email }),
        });
        if (res.ok) await refreshEmails();
    };

    const deleteEmail = async (id: number) => {
        const res = await fetch("/api/emails", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshEmails();
    };

    // ===== UTILISATEURS =====
    const refreshUtilisateurs = async () => {
        const res = await fetch("/api/utilisateurs");
        const data = await res.json();
        setUtilisateurs(data);
    };

    const addUtilisateur = async (u: Partial<Utilisateur>) => {
        if (!u.name || !u.fonction) return console.warn("Nom ou fonction manquante !");
        const res = await fetch("/api/utilisateurs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(u),
        });
        if (res.ok) await refreshUtilisateurs();
    };

    const updateUtilisateur = async (u: Utilisateur) => {
        const res = await fetch("/api/utilisateurs", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(u),
        });
        if (res.ok) await refreshUtilisateurs();
    };

    const deleteUtilisateur = async (id: number) => {
        const res = await fetch("/api/utilisateurs", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshUtilisateurs();
    };

    // ===== PARAMETRES ENTRETIEN =====
    const refreshParametresEntretien = async () => {
        const res = await fetch("/api/parametres-entretien");
        const data = await res.json();
        setParametresEntretien(data);
    };

    const addParametreEntretien = async (p: Partial<ParametreEntretien>) => {
        if (!p.type) return console.warn("Type manquant !");
        const res = await fetch("/api/parametres-entretien", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
        });
        if (res.ok) await refreshParametresEntretien();
    };

    const updateParametreEntretien = async (p: ParametreEntretien) => {
        const res = await fetch("/api/parametres-entretien", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
        });
        if (res.ok) await refreshParametresEntretien();
    };

    const deleteParametreEntretien = async (id: number) => {
        const res = await fetch("/api/parametres-entretien", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshParametresEntretien();
    };

    // ===== DEPENSES =====
    const refreshDepenses = async (vehiculeId: number) => {
        const res = await fetch(`/api/depenses?vehiculeId=${vehiculeId}`);
        const data = await res.json();
        setDepenses(data);
    };

    const addDepense = async (d: Partial<Depense>) => {
        const res = await fetch("/api/depenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(d),
        });
        if (res.ok && d.vehiculeId) await refreshDepenses(d.vehiculeId);
    };

    // ===== Initial load =====
    useEffect(() => {
        refreshVehicules();
        refreshUtilisateurs();
        refreshParametresEntretien();
    }, []);

    return (
        <DataContext.Provider value={{
            vehicules, refreshVehicules, addVehicule, updateVehicule, deleteVehicule,
            emails, refreshEmails, addEmail, updateEmail, deleteEmail,
            utilisateurs, refreshUtilisateurs, addUtilisateur, updateUtilisateur, deleteUtilisateur,
            parametresEntretien, refreshParametresEntretien, addParametreEntretien, updateParametreEntretien, deleteParametreEntretien,
            depenses, refreshDepenses, addDepense,
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