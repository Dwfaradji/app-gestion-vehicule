"use client";

import { useParams } from "next/navigation";
import { useVehicules } from "@/context/vehiculesContext";
import { useDepenses } from "@/context/depensesContext";
import DetailDepensesForVehicle from "@/components/entretiens/DetailDepensesForVehicle";

export default function VehicleDepensesPage() {
    const { id } = useParams();
    const { vehicules } = useVehicules();
    const { depenses } = useDepenses();

    // 1. Trouver le véhicule correspondant
    const vehicle = vehicules.find((v) => v.id === Number(id));


    // 2. Filtrer les dépenses du véhicule
    const depensesForVehicle = depenses.filter(
        (d) => d.vehiculeId === Number(id)
    );

    console.log(depensesForVehicle)

    if (!vehicle) {
        return (
            <div className="p-10 text-center text-red-600 text-lg">
                ❌ Véhicule introuvable
            </div>
        );
    }

    return (
        <DetailDepensesForVehicle
            vehicle={vehicle}
            depenses={depensesForVehicle}
        />
    );
}