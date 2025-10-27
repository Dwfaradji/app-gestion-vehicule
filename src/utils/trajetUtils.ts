import { Trajet, Planification } from "@/types/trajet";
import {Vehicule} from "@/types/vehicule";
import React from "react";

/* -------------------------------------------------------------------------- */
/* ⚙️ TYPES OPTIONNELS SUPPLÉMENTAIRES */
/* -------------------------------------------------------------------------- */

export interface VacancesPeriode {
    debut: string | Date;
    fin: string | Date;
}

/* -------------------------------------------------------------------------- */
/* 🧩 FONCTIONS INTERNES */
/* -------------------------------------------------------------------------- */

/**
 * Retourne la date de fin de période selon le type de planification
 */
const getEndDate = (planif: Planification): Date => {
    const startDate = new Date(planif.startDate);
    const end = new Date(startDate);

    switch (planif.type) {
        case "HEBDO":
            end.setDate(startDate.getDate() + 7);
            break;
        case "MENSUEL":
            end.setMonth(startDate.getMonth() + 1);
            break;
        case "ANNUEL":
            end.setFullYear(startDate.getFullYear() + 1);
            break;
        default:
            end.setDate(startDate.getDate() + 1);
    }

    return end;
};

/**
 * Vérifie si une date donnée est dans la période active de la planification
 */
const isWithinPeriod = (planif: Planification, date: Date): boolean => {
    const start = new Date(planif.startDate);
    const end = getEndDate(planif);
    return date >= start && date <= end;
};

/**
 * Vérifie si une date est dans une période de vacances
 */
const isInVacances = (date: Date, vacances?: VacancesPeriode[]): boolean => {
    if (!vacances || vacances.length === 0) return false;
    return vacances.some((v) => {
        const debut = new Date(v.debut);
        const fin = new Date(v.fin);
        return date >= debut && date <= fin;
    });
};

/**
 * Retourne la "date logique du jour" (bascule à une heure personnalisable)
 * Avant cette heure → on considère que c’est encore la journée précédente.
 */
const getLogicalDate = (date = new Date(), resetHour = 7): Date => {
    const logical = new Date(date);
    if (date.getHours() < resetHour) {
        logical.setDate(date.getDate() - 1);
    }
    logical.setHours(0, 0, 0, 0);
    return logical;
};

/**
 * Vérifie si deux dates appartiennent à la même journée logique
 */
const isSameLogicalDay = (d1: Date, d2: Date, resetHour = 7): boolean => {
    const ld1 = getLogicalDate(d1, resetHour);
    const ld2 = getLogicalDate(d2, resetHour);
    return ld1.getTime() === ld2.getTime();
};

/**
 * Retourne les trajets actifs pour la journée logique actuelle
 */
const getEffectiveTrajets = (
    planif: Planification,
    trajets: Trajet[],
    resetHour = 7,
    vacances?: VacancesPeriode[],
): Trajet[] => {
    const now = new Date();
    const today = getLogicalDate(now, resetHour);

    // 🚫 Si on est en période de vacances, on ne réinitialise jamais
    if (isInVacances(now, vacances)) {
        console.log("🏖️ Vacances détectées → Aucune réinitialisation de tranches");
        return trajets.filter((tr) => isWithinPeriod(planif, new Date(tr.createdAt || "")));
    }

    const effective = trajets.filter((tr) => {
        const dateTrajet = new Date(tr.createdAt || "");
        return (
            isWithinPeriod(planif, dateTrajet) &&
            isSameLogicalDay(today, dateTrajet, resetHour)
        );
    });

    // 🔍 DEBUG
    console.log("🕒 [getEffectiveTrajets]");
    console.log("→ Type planif:", planif.type);
    console.log("→ Heure de reset:", `${resetHour}h00`);
    console.log("→ Date logique actuelle:", today.toLocaleString());
    console.log("→ Nombre de trajets trouvés pour la journée logique:", effective.length);
    console.log("→ Réinitialisation:", effective.length === 0 ? "✅ OUI (nouvelle journée)" : "❌ NON");

    return effective;
};

/* -------------------------------------------------------------------------- */
/* 🚗 MISE À JOUR DU VÉHICULE */
/* -------------------------------------------------------------------------- */

export const updateVehiculeIfNeeded = async (
    updated: Trajet,
    updateVehicule: (v: (Partial<Vehicule> & { id: number })) => Promise<Vehicule | null>,
) => {
    if (updated.kmArrivee) {
        console.log("🚗 Mise à jour du véhicule:", updated.vehiculeId, "→ Nouveau km:", updated.kmArrivee);
        await updateVehicule({ id: updated.vehiculeId, km: updated.kmArrivee });
    }
};

/* -------------------------------------------------------------------------- */
/* 🕒 GESTION DES TRANCHES */
/* -------------------------------------------------------------------------- */

export const handleTranchesAndCreateIfNeeded = async ({
                                                          updated,
                                                          planifications,
                                                          trajets,
                                                          setTrajets,
                                                          resetHour = 7, // ⏰ heure personnalisable
                                                          vacances = [], // 🏖️ périodes de vacances optionnelles
                                                      }: {
    updated: Trajet;
    planifications: Planification[];
    trajets: Trajet[];
    setTrajets: React.Dispatch<React.SetStateAction<Trajet[]>>;
    resetHour?: number;
    vacances?: VacancesPeriode[];
}) => {
    if (!updated.heureDepart || !updated.heureArrivee) return;

    const planif = planifications.find((p) => p.id === updated.planificationId);
    if (!planif) return;

    // 🔍 Tous les trajets liés à la même planif + conducteur
    const allTrajetsPlanif = trajets.filter(
        (tr) => tr.planificationId === planif.id && tr.conducteurId === updated.conducteurId,
    );

    // ✅ On garde uniquement ceux du "jour logique" dans la période
    const trajetsPlanif = getEffectiveTrajets(planif, allTrajetsPlanif, resetHour, vacances);

    // 🧮 Calcule le nombre de tranches max
    const totalTranches =
        planif.nbreTranches === 1 ? planif.nbreTranches : planif.nbreTranches * 2;

    const trajetsExistants = trajetsPlanif.length;

    console.log("📊 [handleTranchesAndCreateIfNeeded]");
    console.log("→ Type planif:", planif.type);
    console.log("→ Heure de réinitialisation:", `${resetHour}h00`);
    console.log("→ Trajets du jour logique:", trajetsExistants);
    console.log("→ Vacances actives:", isInVacances(new Date(), vacances) ? "✅ OUI" : "❌ NON");
    console.log(
        trajetsExistants < totalTranches
            ? "✅ Nouveau trajet sera créé (tranches disponibles)"
            : "❌ Nombre de tranches maximum atteint pour aujourd’hui"
    );

    // 🚀 Si le nombre max n’est pas atteint → crée un nouveau trajet
    if (trajetsExistants < totalTranches) {
        const newTrajet: Partial<Trajet> = {
            conducteurId: updated.conducteurId,
            vehiculeId: updated.vehiculeId,
            planificationId: planif.id,
            kmDepart: updated.kmArrivee ?? 0,
            carburant: updated.carburant ?? 0,
            destination: "À définir",
        };

        const newRes = await fetch("/api/trajets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTrajet),
        });

        if (newRes.ok) {
            const created: Trajet = await newRes.json();
            setTrajets((prev) => [...prev, created]);
            console.log("🆕 Nouveau trajet créé:", created.id);
        } else {
            console.warn("⚠️ Impossible de créer le nouveau trajet");
        }
    }
};