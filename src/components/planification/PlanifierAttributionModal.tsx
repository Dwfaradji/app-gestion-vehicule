"use client";

import React, { useEffect, useState } from "react";
import type { Vehicule } from "@/types/vehicule";
import type { Conducteur, Planification } from "@/types/trajet";
import { PlanifType } from "@prisma/client";
import { useTrajets } from "@/context/trajetsContext";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

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
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
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
    useTrajets();

  const [vehiculeId, setVehiculeId] = useState<number | null>(initial?.vehiculeId ?? null);
  const [conducteurId, setConducteurId] = useState<number | null>(initial?.conducteurId ?? null);
  const [startDate, setStartDate] = useState(formatDateInput(initial?.startDate));
  const [startTime, setStartTime] = useState(formatTimeInput(initial?.startDate));
  const [endDate, setEndDate] = useState(formatDateInput(initial?.endDate));
  const [endTime, setEndTime] = useState(formatTimeInput(initial?.endDate));
  const [type, setType] = useState<keyof typeof PLANIF_TYPES>("hebdo");
  const [saving, setSaving] = useState(false);
  const [nbreTranches, setNbreTranches] = useState<number>(initial?.nbreTranches ?? 1);
  const [errorMsg, setErrorMsg] = useState<string>("");

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

  // ✅ Vérification dynamique des champs requis

  const PlanificationIsValid = !startDate || !endDate || !vehiculeId || !conducteurId || !type;

  const savePlanification = async () => {
    if (errorMsg) return;

    // Guards: required fields
    if (!startDate || !endDate) {
      setErrorMsg("Veuillez renseigner les dates de début et de fin.");
      return;
    }
    if (vehiculeId == null || conducteurId == null) {
      setErrorMsg("Sélectionnez un véhicule et un conducteur.");
      return;
    }

    const startISO = toISOStringLocal(startDate, startTime);
    const endISO = toISOStringLocal(endDate, endTime);

    if (Date.parse(endISO) <= Date.parse(startISO)) {
      setErrorMsg("La fin doit être après le début !");
      return;
    }

    // After guards, narrow to numbers for TypeScript
    const vId: number = vehiculeId;
    const cId: number = conducteurId;

    const overlaps = planifications.some(
      (p) =>
        p.vehiculeId === vId &&
        p.id !== initial?.id &&
        !(
          Date.parse(p.endDate) <= Date.parse(startISO) ||
          Date.parse(p.startDate) >= Date.parse(endISO)
        ),
    );

    if (overlaps) {
      setErrorMsg("Ce véhicule est déjà attribué sur cette période.");
      return;
    }

    const payload: Omit<Planification, "id"> = {
      vehiculeId: vId,
      conducteurId: cId,
      startDate: startISO,
      endDate: endISO,
      type: PLANIF_TYPES[type] ?? "HEBDO",
      nbreTranches,
    };

    setSaving(true);
    try {
      if (initial?.id) {
        await updatePlanification(initial.id, payload);
      } else {
        await addPlanification(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur lors de la sauvegarde.");
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

  const inputErrorClass = (condition: boolean) =>
    `border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 ${
      condition ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
    }`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="w-full md:w-96" maxHeight="max-h-[90vh]">
      <div className="flex flex-col p-6 gap-4">
        {errorMsg && <span className="text-red-500 text-sm">{errorMsg}</span>}

        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {initial?.id ? "Modifier l’attribution" : "Planifier une attribution"}
        </h3>

        {/* Période */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Période</label>
          <div className="flex gap-2">
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputErrorClass(!startDate)}
            />
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={inputErrorClass(false)}
            />
          </div>
          <div className="flex gap-2">
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputErrorClass(!endDate)}
            />
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputErrorClass(false)}
            />
          </div>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="jour">Journée</option>
            <option value="hebdo">Hebdomadaire</option>
            <option value="mois">Mensuelle</option>
            <option value="annuel">Annuelle</option>
          </select>
        </div>

        {/* Véhicule */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Véhicule</label>
          <select
            id="vehiculeId"
            value={vehiculeId ?? ""}
            onChange={(e) => setVehiculeId(Number(e.target.value) || null)}
            className={inputErrorClass(!vehiculeId)}
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
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conducteur</label>
          <select
            id="conducteurId"
            value={conducteurId ?? ""}
            onChange={(e) => setConducteurId(Number(e.target.value) || null)}
            className={inputErrorClass(!conducteurId)}
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
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre de tranches (aller/retour)
          </label>
          <input
            id="nbreTranches"
            type="number"
            min="1"
            value={nbreTranches}
            onChange={(e) => setNbreTranches(Number(e.target.value))}
            className={inputErrorClass(false)}
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-2 mt-4">
          {initial?.id && (
            <Button variant="danger" onClick={handleDelete} disabled={saving}>
              Supprimer
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={savePlanification} disabled={PlanificationIsValid}>
            {initial?.id ? "Mettre à jour" : "Planifier"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
