"use client";

import { Vehicule } from "@/types/vehicule";
import { Wrench, AlertCircle, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TotauxProps {
    vehicules: Vehicule[];
}

const Totaux = ({ vehicules }: TotauxProps) => {
    const totalMaintenance = vehicules.filter(v => v.statut === "Maintenance").length;
    const totalIncident = vehicules.filter(v => v.statut === "Incident").length;
    const totalDisponible = vehicules.filter(v => v.statut === "Disponible").length;
    const totalVehicules = vehicules.length;

    const stats = [
        { label: "Total véhicules", value: totalVehicules, color: "bg-blue-100 text-blue-700", Icon: Truck },
        { label: "Disponible", value: totalDisponible, color: "bg-green-100 text-green-700", Icon: CheckCircle },
        { label: "En maintenance", value: totalMaintenance, color: "bg-yellow-100 text-yellow-700", Icon: Wrench },
        { label: "Incident", value: totalIncident, color: "bg-red-100 text-red-700", Icon: AlertCircle },
    ];

    return (
        <div className="flex gap-4 mt-4 flex-wrap">
            {stats.map((s, index) => (
                <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    className={`flex-1 min-w-[180px] flex items-center gap-3 p-4 rounded-xl shadow-sm ${s.color} font-semibold`}
                >
                    <s.Icon className="h-6 w-6" />
                    <div>
                        <p className="text-sm">{s.label}</p>
                        <p className="text-lg font-bold">{s.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default Totaux;