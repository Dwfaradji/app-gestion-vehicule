"use client";

import React from "react";
import { Vehicule } from "@/types/vehicule";
import { Wrench, AlertCircle, Truck, CheckCircle, Clock, ShieldAlert } from "lucide-react";

interface TotauxProps {
    vehicules: Vehicule[];
}

interface Stat {
    id: string;
    label: string;
    value: number | string;
    color: string;
    Icon: any;
}

export default function Totaux({ vehicules }: TotauxProps) {
    const totalMaintenance = vehicules.filter(v => v.statut === "Maintenance").length;
    const totalIncident = vehicules.filter(v => v.statut === "Incident").length;
    const ctExpire = vehicules.filter(v => v.ctValidite && new Date(v.ctValidite) < new Date()).length;
    const revisionsARelancer = vehicules.filter(v => v.prochaineRevision && new Date(v.prochaineRevision) < new Date()).length;
    const totalDisponible = vehicules.filter(v => v.statut === "Disponible").length;

    const stats: Stat[] = [
        { id: "ct-expire", label: "CT expiré", value: ctExpire, color: "bg-orange-100 text-orange-700", Icon: ShieldAlert },
        { id: "revision", label: "Révision à refaire", value: revisionsARelancer, color: "bg-purple-100 text-purple-700", Icon: Clock },
        { id: "incident", label: "Incident", value: totalIncident, color: "bg-red-100 text-red-700", Icon: AlertCircle },
        { id: "maintenance", label: "En maintenance", value: totalMaintenance, color: "bg-yellow-100 text-yellow-700", Icon: Wrench },
        { id: "disponible", label: "Disponible", value: totalDisponible, color: "bg-green-100 text-green-700", Icon: CheckCircle },
        { id: "total", label: "Total véhicules", value: vehicules.length, color: "bg-blue-100 text-blue-700", Icon: Truck },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gray-50 shadow-inner z-50 flex flex-wrap gap-4">
            {stats.map(stat => (
                <div
                    key={stat.id}
                    className={`flex-1 min-w-[180px] p-4 rounded-xl shadow-md ${stat.color} flex items-center gap-3`}
                >
                    <stat.Icon size={24} />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold">{stat.value}</span>
                        <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}