"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import type { Vehicule } from "@/types/vehicule";
import type { Conducteur, Planification } from "@/types/trajet";
import { PlanifType } from "@prisma/client";
import { useTrajets } from "@/context/trajetsContext"; // ✅ Contexte importé

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehicules: Vehicule[];
  conducteurs: Conducteur[];
  initial?: Partial<Planification>;
}

// --- Helpers ---
const formatDateInput = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");
const formatTimeInput = (iso?: string) => {
  if (!iso) return "12:00";
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const PLANIF_TYPES: Record<string, PlanifType> = {
  jour: "JOUR",
  hebdo: "HEBDO",
  mois: "MENSUEL",
  annuel: "ANNUEL",
};

const toISOStringLocal = (dateStr: string, timeStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const d = new Date(year, month - 1, day, hour, minute);
  return d.toISOString();
};

export default function PlanifierAttributionModal({
  isOpen,
  onClose,
  vehicules,
  conducteurs,
  initial,
}: Props) {
  const { planifications, addPlanification, updatePlanification, deletePlanification } =
    useTrajets(); // ✅ on récupère tout depuis le contexte

  const [vehiculeId, setVehiculeId] = useState<number | null>(initial?.vehiculeId ?? null);
  const [conducteurId, setConducteurId] = useState<number | null>(initial?.conducteurId ?? null);
  const [startDate, setStartDate] = useState(formatDateInput(initial?.startDate));
  const [startTime, setStartTime] = useState(formatTimeInput(initial?.startDate));
  const [endDate, setEndDate] = useState(formatDateInput(initial?.endDate));
  const [endTime, setEndTime] = useState(formatTimeInput(initial?.endDate));
  const [type, setType] = useState<keyof typeof PLANIF_TYPES>("hebdo");
  const [saving, setSaving] = useState(false);
  const [nbreTranches, setNbreTranches] = useState<number>(initial?.nbreTranches ?? 1);

  useEffect(() => {
    setVehiculeId(initial?.vehiculeId ?? null);
    setConducteurId(initial?.conducteurId ?? null);
    setStartDate(formatDateInput(initial?.startDate));
    setStartTime(formatTimeInput(initial?.startDate));
    setEndDate(formatDateInput(initial?.endDate));
    setEndTime(formatTimeInput(initial?.endDate));
    setType(
      (Object.keys(PLANIF_TYPES).find(
        (k) => PLANIF_TYPES[k] === initial?.type,
      ) as keyof typeof PLANIF_TYPES) ?? "hebdo",
    );
  }, [initial, isOpen]);

  const savePlanification = async () => {
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

    // Vérifie les chevauchements
    const overlaps = planifications.some(
      (p) =>
        p.vehiculeId === vehiculeId &&
        p.id !== initial?.id && // ⚠️ ignore la planif en cours
        !(
          Date.parse(p.endDate) <= Date.parse(startISO) ||
          Date.parse(p.startDate) >= Date.parse(endISO)
        ),
    );

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
      nbreTranches,
    };

    setSaving(true);

    try {
      let savedPlanif: Planification | null;

      if (initial?.id) {
        // ✅ Mise à jour
        savedPlanif = await updatePlanification(initial.id, payload);
        // Si les heures sont renseignées, on ajoute une ligne de trajet pour chaque tranche
        if (startTime && endTime) {
          for (let i = 0; i < nbreTranches; i++) {
            await fetch("/api/trajets", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                planificationId: Number(savedPlanif && savedPlanif.id),
                vehiculeId,
                conducteurId,
                kmDepart: 0, // ou récupéré dynamiquement
                carburant: 0, // ou récupéré dynamiquement
              }),
            });
          }
        }
      } else {
        // ✅ Création
        await addPlanification(payload);
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initial?.id) return;
    setSaving(true);
    try {
      await deletePlanification(initial.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          {initial?.id ? "Modifier l’attribution" : "Planifier une attribution"}
        </h3>

        {/* Période */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Période</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2 w-1/2"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded px-3 py-2 w-1/2"
            />
          </div>
          <div className="flex gap-2 mt-1">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2 w-1/2"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded px-3 py-2 w-1/2"
            />
          </div>
        </div>

        {/* Type */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as keyof typeof PLANIF_TYPES)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="jour">Journée</option>
            <option value="hebdo">Hebdomadaire</option>
            <option value="mois">Mensuelle</option>
            <option value="annuel">Annuelle</option>
          </select>
        </div>

        {/* Véhicule */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Véhicule</label>
          <select
            value={vehiculeId ?? ""}
            onChange={(e) => setVehiculeId(Number(e.target.value) || null)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">— Choisir —</option>
            {vehicules.map((v) => (
              <option key={v.id} value={v.id}>
                {v.modele} — {v.immat}
              </option>
            ))}
          </select>
        </div>

        {/* Conducteur */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Conducteur</label>
          <select
            value={conducteurId ?? ""}
            onChange={(e) => setConducteurId(Number(e.target.value) || null)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">— Choisir —</option>
            {conducteurs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.prenom} {c.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre de tranches */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Nombre de tranches (aller/retour)
          </label>
          <input
            type="number"
            min="1"
            value={nbreTranches}
            onChange={(e) => setNbreTranches(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-2">
          {initial?.id && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Supprimer
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 rounded border hover:bg-gray-100">
            Annuler
          </button>
          <button
            onClick={savePlanification}
            disabled={saving}
            className={`px-4 py-2 rounded text-white ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {initial?.id ? "Mettre à jour" : "Planifier"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
