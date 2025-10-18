"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import type { Vehicule } from "@/types/vehicule";
import type { Conducteur, Planification } from "@/types/trajet";
import { PlanifType } from "@prisma/client";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    vehicules: Vehicule[];
    conducteurs: Conducteur[];
    visiblePlanifs: Planification[];
    initial?: Partial<Planification>;
    onSave: (p: Omit<Planification, "id">) => Promise<Planification | void>;
    onUpdate?: (id: number, patch: Partial<Planification>) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

// --- Helpers pour inputs HTML ---
const formatDateInput = (iso?: string) => iso ? new Date(iso).toISOString().slice(0, 10) : "";
const formatTimeInput = (iso?: string) => {
    if (!iso) return "12:00";
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
};

// Mapping frontend string -> PlanifType
const PLANIF_TYPES: Record<string, PlanifType> = {
    jour: "JOUR",
    hebdo: "HEBDO",
    mois: "MENSUEL",
    annuel: "ANNUEL",
};

// Conversion date+heure locale en ISO
const toISOStringLocal = (dateStr: string, timeStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    const d = new Date(year, month-1, day, hour, minute);
    return d.toISOString();
};

export default function PlanifierAttributionModal({
                                                      isOpen, onClose, vehicules, conducteurs, initial, onSave, onUpdate, onDelete, visiblePlanifs
                                                  }: Props) {
    const [vehiculeId, setVehiculeId] = useState<number | null>(initial?.vehiculeId ?? null);
    const [conducteurId, setConducteurId] = useState<number | null>(initial?.conducteurId ?? null);
    const [startDate, setStartDate] = useState(formatDateInput(initial?.startDate));
    const [startTime, setStartTime] = useState(formatTimeInput(initial?.startDate));
    const [endDate, setEndDate] = useState(formatDateInput(initial?.endDate));
    const [endTime, setEndTime] = useState(formatTimeInput(initial?.endDate));
    const [type, setType] = useState<keyof typeof PLANIF_TYPES>("hebdo");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setVehiculeId(initial?.vehiculeId ?? null);
        setConducteurId(initial?.conducteurId ?? null);
        setStartDate(formatDateInput(initial?.startDate));
        setStartTime(formatTimeInput(initial?.startDate));
        setEndDate(formatDateInput(initial?.endDate));
        setEndTime(formatTimeInput(initial?.endDate));
        setType(Object.keys(PLANIF_TYPES).find(k => PLANIF_TYPES[k] === initial?.type) as keyof typeof PLANIF_TYPES ?? "hebdo");
    }, [initial, isOpen]);

    const handleSave = async () => {
        if (!vehiculeId || !conducteurId || !startDate || !endDate) {
            alert("Veuillez remplir toutes les informations.");
            return;
        }

        const startISO = toISOStringLocal(startDate, startTime);
        const endISO = toISOStringLocal(endDate, endTime);

        if (Date.parse(endISO) <= Date.parse(startISO)) {
            alert("La fin doit être après le début !");
            return;
        }

        const overlaps = visiblePlanifs.some(p => p.vehiculeId === vehiculeId && !(Date.parse(p.endDate) <= Date.parse(startISO) || Date.parse(p.startDate) >= Date.parse(endISO)));
        if (overlaps) {
            alert("Ce véhicule est déjà attribué sur cette période.");
            return;
        }

        const payload: Omit<Planification, "id"> = {
            vehiculeId,
            conducteurId,
            startDate: startISO,
            endDate: endISO,
            type: PLANIF_TYPES[type] ?? "HEBDO",
        };

        try {
            if (initial?.id && onUpdate) await onUpdate(initial.id, payload);
            else await onSave(payload);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue lors de la sauvegarde.");
        }
    };

    const handleDelete = async () => {
        if (!initial?.id || !onDelete) return;
        setSaving(true);
        try { await onDelete(initial.id); onClose(); }
        catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Planifier une attribution</h3>

                {/* Dates et heures */}
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Période</label>
                    <div className="flex gap-2">
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-3 py-2 w-1/2"/>
                        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="border rounded px-3 py-2 w-1/2"/>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-3 py-2 w-1/2"/>
                        <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="border rounded px-3 py-2 w-1/2"/>
                    </div>
                </div>

                {/* Type */}
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value as keyof typeof PLANIF_TYPES)} className="border rounded px-3 py-2 w-full">
                        <option value="jour">Journée</option>
                        <option value="hebdo">Hebdomadaire</option>
                        <option value="mois">Mensuelle</option>
                        <option value="annuel">Annuelle</option>
                    </select>
                </div>

                {/* Véhicule */}
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Véhicule</label>
                    <select value={vehiculeId ?? ""} onChange={e => setVehiculeId(Number(e.target.value) || null)} className="border rounded px-3 py-2 w-full">
                        <option value="">— Choisir —</option>
                        {vehicules.map(v => <option key={v.id} value={v.id}>{v.modele} — {v.immat}</option>)}
                    </select>
                </div>

                {/* Conducteur */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Conducteur</label>
                    <select value={conducteurId ?? ""} onChange={e => setConducteurId(Number(e.target.value) || null)} className="border rounded px-3 py-2 w-full">
                        <option value="">— Choisir —</option>
                        {conducteurs.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                    </select>
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-2">
                    {initial?.id && onDelete && <button onClick={handleDelete} disabled={saving} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Supprimer</button>}
                    <button onClick={onClose} className="px-4 py-2 rounded border hover:bg-gray-100">Annuler</button>
                    <button onClick={handleSave} disabled={saving} className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                        {initial?.id ? "Mettre à jour" : "Planifier"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}