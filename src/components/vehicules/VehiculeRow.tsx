"use client";

import type { Vehicule } from "@/types/vehicule";
import { Trash2 } from "lucide-react";
import React from "react";
import type { ConfirmAction } from "@/types/actions";

interface VehiculeRowProps {
  vehicule: Vehicule;
  setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function VehiculeRow({ vehicule, setConfirmAction }: VehiculeRowProps) {
  return (
    <button
      onClick={() => setConfirmAction({ type: "supprimer-vehicule", target: vehicule })}
      className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
    >
      <Trash2 className="w-5 h-5 text-red-600" />
    </button>
  );
}
