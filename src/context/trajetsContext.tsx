"use client";

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import {Conducteur, Trajet} from "@/types/trajet";



interface TrajetsContextProps {
    conducteurs: Conducteur[];
    trajets: Trajet[];
    refreshAll: () => Promise<void>;
    addTrajet: (t: Partial<Trajet>) => Promise<Trajet | null>;
    updateTrajet: (t: Partial<Trajet> & { id: number }) => Promise<Trajet | null>;
    deleteTrajet: (id: number) => Promise<boolean>;
    addConducteur: (c: Partial<Conducteur>) => Promise<Conducteur | null>;
    updateConducteur: (c: Partial<Conducteur> & { id: number }) => Promise<Conducteur | null>;
    deleteConducteur: (id: number) => Promise<boolean>;
}

const TrajetsContext = createContext<TrajetsContextProps | undefined>(undefined);

export const TrajetsProvider = ({ children }: { children: ReactNode }) => {
    const [conducteurs, setConducteurs] = useState<Conducteur[]>([]);
    const [trajets, setTrajets] = useState<Trajet[]>([]);
    const { updateVehicule } = useVehicules();

    // GET
    const fetchConducteurs = useCallback(async () => {
        const res = await fetch("/api/conducteurs");
        if (!res.ok) throw new Error("Erreur fetch conducteurs");
        const data: Conducteur[] = await res.json();
        setConducteurs(data);
    }, []);

    const fetchTrajets = useCallback(async () => {
        const res = await fetch("/api/trajets");
        if (!res.ok) throw new Error("Erreur fetch trajets");
        const data: Trajet[] = await res.json();
        setTrajets(data);
    }, []);

    const refreshAll = useCallback(async () => {
        await Promise.all([fetchTrajets(), fetchConducteurs()]);
    }, [fetchTrajets, fetchConducteurs]);

    // POST Trajet
    const addTrajet = useCallback(async (t: Partial<Trajet>) => {
        const res = await fetch("/api/trajets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(t),
        });
        if (res.ok) {
            const saved: Trajet = await res.json();
            setTrajets(prev => [...prev, saved]);
            return saved;
        }
        return null;
    }, []);

    // PUT Trajet
    const updateTrajet = useCallback(async (t: Partial<Trajet> & { id: number }) => {
        const res = await fetch("/api/trajets", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(t),
        });
        if (res.ok) {
            const updated: Trajet = await res.json();
            setTrajets(prev => prev.map(x => (x.id === updated.id ? updated : x)));

            // 🔗 si kmArrivee renseigné → mise à jour du véhicule
            if (updated.kmArrivee) {
                await updateVehicule({ id: updated.vehiculeId, km: updated.kmArrivee });
            }

            return updated;
        }
        return null;
    }, [updateVehicule]);

    // DELETE Trajet
    const deleteTrajet = useCallback(async (id: number) => {
        const res = await fetch("/api/trajets", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            setTrajets(prev => prev.filter(x => x.id !== id));
            return true;
        }
        return false;
    }, []);

    // POST Conducteur
    const addConducteur = useCallback(async (c: Partial<Conducteur>) => {
        const res = await fetch("/api/conducteurs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(c),
        });
        if (res.ok) {
            const saved: Conducteur = await res.json();
            setConducteurs(prev => [...prev, saved]);
            return saved;
        }
        return null;
    }, []);

    // PUT Conducteur
    const updateConducteur = useCallback(async (c: Partial<Conducteur> & { id: number }) => {
        const res = await fetch("/api/conducteurs", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(c),
        });
        if (res.ok) {
            const updated: Conducteur = await res.json();
            setConducteurs(prev => prev.map(x => (x.id === updated.id ? updated : x)));
            return updated;
        }
        return null;
    }, []);

    // DELETE Conducteur
    const deleteConducteur = useCallback(async (id: number) => {
        const res = await fetch("/api/conducteurs", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) {
            setConducteurs(prev => prev.filter(x => x.id !== id));
            // 🔗 supprime la référence dans trajets
            setTrajets(prev =>
                prev.map(t => (t.conducteurId === id ? { ...t, conducteurId: null } : t))
            );
            return true;
        }
        return false;
    }, []);

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    return (
        <TrajetsContext.Provider
            value={{
                conducteurs,
                trajets,
                refreshAll,
                addTrajet,
                updateTrajet,
                deleteTrajet,
                addConducteur,
                updateConducteur,
                deleteConducteur,
            }}
        >
            {children}
        </TrajetsContext.Provider>
    );
};

export const useTrajets = () => {
    const context = useContext(TrajetsContext);
    if (!context) throw new Error("useTrajets must be used within a TrajetsProvider");
    return context;
};