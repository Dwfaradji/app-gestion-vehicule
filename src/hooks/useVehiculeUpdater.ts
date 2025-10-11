"use client";

import { useState, useCallback } from "react";
import { useVehicules } from "@/context/vehiculesContext";

interface UpdateVehiculeParams {
  km?: number;
  prochaineRevision?: string;
  dateEntretien?: string;
  ctValidite?: string;
  [key: string]: string | number | undefined;
}

export const useVehiculeUpdater = () => {
  const { updateVehicule } = useVehicules();
  const [loading, setLoading] = useState(false);

  const isDate = (value: unknown): value is Date => value instanceof Date;

  const updateVehiculeSafe = useCallback(
    async (
      vehiculeId: number,
      params: UpdateVehiculeParams & Record<string, string | number | Date | undefined>,
    ) => {
      setLoading(true);
      try {
        // Convertir les champs Date en string ISO
        const formattedParams: UpdateVehiculeParams = { ...params };
        if (params.dateEntretien && isDate(params.dateEntretien)) {
          formattedParams.dateEntretien = params.dateEntretien.toISOString();
        }
        if (params.prochaineRevision && isDate(params.prochaineRevision)) {
          formattedParams.prochaineRevision = params.prochaineRevision.toISOString();
        }

        await updateVehicule({ id: vehiculeId, ...formattedParams });
      } catch (err) {
        console.error("Erreur mise à jour véhicule:", err);
      } finally {
        setLoading(false);
      }
    },
    [updateVehicule],
  );

  const validerCT = useCallback(
    async (vehiculeId: number, contreVisite = false) => {
      setLoading(true);
      try {
        const newDate = new Date();
        newDate.setFullYear(newDate.getFullYear() + 1);
        if (contreVisite) newDate.setMonth(newDate.getMonth() + 3);

        await updateVehicule({ id: vehiculeId, ctValidite: newDate.toISOString() });
        return newDate.toISOString();
      } catch (err) {
        console.error("Erreur validation CT:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [updateVehicule],
  );

  return { updateVehiculeSafe, validerCT, loading };
};
