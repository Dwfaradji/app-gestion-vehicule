"use client";

import { useState, useEffect, useCallback } from "react";
import {Planification} from "@/types/trajet";

export function usePlanifications() {
    const [planifications, setPlanifications] = useState<Planification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/planifications");
            const data = await res.json();
            setPlanifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("fetchAll planifs error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addPlanification = useCallback(async (p: Omit<Planification, "id">) => {
        const res = await fetch("/api/planifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
        });
        if (!res.ok) throw new Error(await res.text());
        const created = await res.json();
        setPlanifications((prev) => [created, ...prev]);
        return created;
    }, []);

    const updatePlanification = useCallback(async (id: number, patch: Partial<Planification>) => {
        const res = await fetch(`/api/planifications/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        });
        const updated = await res.json();
        setPlanifications((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return updated;
    }, []);

    const removePlanification = useCallback(async (id: number) => {
        await fetch(`/api/planifications/${id}`, { method: "DELETE" });
        setPlanifications((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const getByDateRange = useCallback((startISO: string, endISO: string) => {
        const start = new Date(startISO).getTime();
        const end = new Date(endISO).getTime();
        return planifications.filter((p) => {
            const ps = new Date(p.startDate).getTime();
            const pe = new Date(p.endDate).getTime();
            return !(pe < start || ps > end);
        });
    }, [planifications]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return { planifications, loading, addPlanification, updatePlanification, removePlanification, getByDateRange, refresh: fetchAll };
}