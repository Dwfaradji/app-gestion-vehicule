"use client";

import React, { useMemo, useState } from "react";
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, addMonths, startOfYear, addYears } from "date-fns";
import { fr } from "date-fns/locale";

import { useVehicules } from "@/context/vehiculesContext";
import { useTrajets } from "@/context/trajetsContext";
import { usePlanifications } from "@/hooks/usePlanifications";
import PlanifierAttributionModal from "./PlanifierAttributionModal";
import clsx from "clsx";
import {Planification} from "@/types/trajet";

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 21;
type ViewMode = "jour" | "semaine" | "mois" | "année";

function mapViewToPlanifType(view: ViewMode) {
    switch (view) {
        case "jour": return "JOUR";
        case "semaine": return "HEBDO";
        case "mois": return "MENSUEL";
        case "année": return "ANNUEL";
        default: return "HEBDO";
    }
}

const colorForConducteur = (id: number) => {
    const colors = ["bg-indigo-200","bg-green-200","bg-pink-200","bg-yellow-200","bg-purple-200","bg-red-200"];
    return colors[id % colors.length];
};

// --- Formatteur heure locale ---
const formatLocalTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

export default function PlanningView() {
    const { vehicules } = useVehicules();
    const { conducteurs } = useTrajets();
    const { planifications, addPlanification, updatePlanification, removePlanification, getByDateRange } = usePlanifications();

    const [view, setView] = useState<ViewMode>("semaine");
    const [cursor, setCursor] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    // --- Calcul des dates affichées et plage visible ---
    const { rangeStartISO, rangeEndISO, displayDays, displayMonths, dayHours } = useMemo(() => {
        const now = cursor;
        const hours: number[] = [];
        if (view === "jour") for (let h = DAY_START_HOUR; h <= DAY_END_HOUR; h++) hours.push(h);

        if (view === "semaine") {
            const s = startOfWeek(now, { weekStartsOn: 1 });
            const e = endOfWeek(now, { weekStartsOn: 1 });
            return {
                rangeStartISO: s.toISOString(),
                rangeEndISO: e.toISOString(),
                displayDays: Array.from({ length: 7 }).map((_, i) => addDays(s, i)),
                displayMonths: [],
                dayHours: []
            };
        }
        if (view === "mois") {
            const s = startOfMonth(now);
            const e = endOfMonth(now);
            const days: Date[] = [];
            for (let d = new Date(s); d <= e; d = addDays(d, 1)) days.push(new Date(d));
            return { rangeStartISO: s.toISOString(), rangeEndISO: e.toISOString(), displayDays: days, displayMonths: [], dayHours: [] };
        }
        if (view === "année") {
            const s = startOfYear(now);
            const months = Array.from({ length: 12 }).map((_, i) => addMonths(s, i));
            return { rangeStartISO: s.toISOString(), rangeEndISO: addYears(s, 1).toISOString(), displayDays: [], displayMonths: months, dayHours: [] };
        }
        const s = new Date(now); s.setHours(0,0,0,0);
        const e = new Date(now); e.setHours(23,59,59,999);
        return { rangeStartISO: s.toISOString(), rangeEndISO: e.toISOString(), displayDays: [s], displayMonths: [], dayHours: hours };
    }, [cursor, view]);

    const visiblePlanifs = getByDateRange(rangeStartISO, rangeEndISO);

    const byVehicule = useMemo(() => {
        const map = new Map<number, typeof visiblePlanifs>();
        vehicules.forEach(v => map.set(v.id, visiblePlanifs.filter(p => p.vehiculeId === v.id)));
        return map;
    }, [vehicules, visiblePlanifs]);

    const goPrev = () => {
        if(view==="jour") setCursor(c=>addDays(c,-1));
        if(view==="semaine") setCursor(c=>addDays(c,-7));
        if(view==="mois") setCursor(c=>addMonths(c,-1));
        if(view==="année") setCursor(c=>addYears(c,-1));
    };
    const goNext = () => {
        if(view==="jour") setCursor(c=>addDays(c,1));
        if(view==="semaine") setCursor(c=>addDays(c,7));
        if(view==="mois") setCursor(c=>addMonths(c,1));
        if(view==="année") setCursor(c=>addYears(c,1));
    };
    const goToday = () => setCursor(new Date());

    const openCreate = (vehiculeId?: number, day?: Date, hour?: number) => {
        const base = day ? new Date(day) : new Date(cursor);
        if(typeof hour==="number") base.setHours(hour,0,0,0); else base.setHours(12,0,0,0);
        const end = new Date(base); end.setHours(base.getHours()+1);
        setEditing({
            vehiculeId: vehiculeId??null,
            conducteurId:null,
            startDate: base.toISOString(),
            endDate: end.toISOString(),
            type: mapViewToPlanifType(view)
        });
        setModalOpen(true);
    };
    const openEdit = (planif:Planification)=>{ setEditing(planif); setModalOpen(true); };

    const headerLabel = (d:Date, month=false) => view==="jour"?format(d,"EEEE dd MMM yyyy",{locale:fr}):month?format(d,"MMM",{locale:fr}):format(d,"dd/MM",{locale:fr});

    const handleSave = async (p:any) => await addPlanification({ ...p, type: p.type ?? mapViewToPlanifType(view) });
    const handleUpdate = async (id:number, patch:any) => await updatePlanification(id, { ...patch, type: patch.type ? String(patch.type).toUpperCase() : undefined });

    const planifsForCell = (vId: number, cellStart: Date, cellEnd: Date) => {
        return (byVehicule.get(vId) || []).filter(p => {
            const ps = new Date(p.startDate).getTime();
            const pe = new Date(p.endDate).getTime();
            if (view === "jour") return !(pe <= cellStart.getTime() || ps >= cellEnd.getTime());
            return !(pe < cellStart.getTime() || ps > cellEnd.getTime());
        });
    };

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Planification des attributions</h1>
                    <div className="text-sm text-gray-500 mt-1">Vue : <strong className="capitalize">{view}</strong></div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-1 border rounded overflow-hidden">
                        {["jour","semaine","mois","année"].map(v=>
                            <button key={v} onClick={()=>setView(v as ViewMode)} className={`px-3 py-1 ${view===v?"bg-blue-600 text-white":"bg-white"}`}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
                        )}
                    </div>
                    <button onClick={goPrev} className="px-3 py-1 border rounded">←</button>
                    <button onClick={goToday} className="px-3 py-1 border rounded">Aujourd&#39;hui</button>
                    <button onClick={goNext} className="px-3 py-1 border rounded">→</button>
                    <button onClick={()=>openCreate()} className="ml-3 px-3 py-1 bg-green-600 text-white rounded">Nouvelle attribution</button>
                </div>
            </div>

            {/* Grid */}
            <div className="bg-white rounded shadow overflow-auto">
                <table className="min-w-full table-fixed">
                    <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th className="w-48 p-3 text-left">Véhicule</th>
                        {(view==="jour"?dayHours:(view==="année"?displayMonths:displayDays)).map((d:any,idx)=>(
                            <th key={idx} className="p-2 text-left">
                                <div className="text-sm font-medium">{view==="jour"?`${d}h`:headerLabel(d, view==="année")}</div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {vehicules.map(v=>(
                        <tr key={v.id} className="border-t hover:bg-gray-50">
                            <td className="p-3 align-top">
                                <div className="font-medium">{v.modele}</div>
                                <div className="text-xs text-gray-500">{v.immat}</div>
                            </td>
                            {(view==="jour"?dayHours:(view==="année"?displayMonths:displayDays)).map((d:any,idx)=>{
                                const cellStart = new Date(view==="jour"?cursor:d);
                                if(view==="jour") cellStart.setHours(d,0,0,0);
                                else cellStart.setHours(0,0,0,0);
                                const cellEnd = new Date(cellStart);
                                if(view==="jour") cellEnd.setHours(d+1,0,0,0);
                                else cellEnd.setHours(23,59,59,999);

                                const cellPlanifs = planifsForCell(v.id, cellStart, cellEnd);

                                return (
                                    <td key={idx} className="p-1 align-top">
                                        {cellPlanifs.length===0?(
                                            <button onClick={()=>openCreate(v.id,cellStart,view==="jour"?d:undefined)} className="w-full h-8 border rounded text-gray-500 hover:bg-gray-50">+</button>
                                        ):(
                                            <div className="flex flex-col gap-1">
                                                {cellPlanifs.map(p=>{
                                                    const conducteur = conducteurs.find(c=>c.id===p.conducteurId);
                                                    const label = conducteur?`${conducteur.prenom} ${conducteur.nom}`:"Conducteur";
                                                    const timeRange = `${formatLocalTime(p.startDate)} → ${formatLocalTime(p.endDate)}`;
                                                    const color = conducteur?colorForConducteur(Number(conducteur.id)):"bg-gray-200";
                                                    return (
                                                        <div key={p.id} onClick={()=>openEdit(p)}
                                                             className={clsx("p-1 rounded shadow-sm text-xs cursor-pointer transition-all hover:scale-105 relative", color)}
                                                             title={`${label}\n${v.modele} (${v.immat})\n${p.type}\n${timeRange}`}>
                                                            <div className="font-medium truncate">{label}</div>
                                                            <div className="truncate">{timeRange}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <PlanifierAttributionModal
                isOpen={modalOpen}
                onClose={()=>{setModalOpen(false); setEditing(null);}}
                vehicules={vehicules}
                visiblePlanifs={visiblePlanifs}
                conducteurs={conducteurs}
                initial={editing??undefined}
                onSave={async p => {
                    const start = Date.parse(p.startDate);
                    const end = Date.parse(p.endDate);
                    const overlaps = visiblePlanifs.some(planif => {
                        if (planif.vehiculeId !== p.vehiculeId) return false;
                        const ps = Date.parse(planif.startDate);
                        const pe = Date.parse(planif.endDate);
                        return !(pe <= start || ps >= end);
                    });
                    if (overlaps) throw new Error("Ce véhicule est déjà attribué sur cette période.");
                    return await handleSave({ ...p, type: p.type ?? mapViewToPlanifType(view) });
                }}
                onUpdate={async (id,patch)=>await handleUpdate(id,patch)}
                onDelete={async id=>await removePlanification(id)}
            />
        </div>
    );
}