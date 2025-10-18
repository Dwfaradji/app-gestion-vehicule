import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { generateAllNotifications } from "@/utils/generateAllNotifications";
import { broadcastRemoveNotification, broadcastNotification } from "@/lib/sse";
import type { Vehicule, VehiculeStatus } from "@/types/vehicule";
import type { ParametreEntretien } from "@/types/entretien";
import type { Depense } from "@/types/depenses";
import { VehicleType } from "@/data/maintenanceParams";

// ----------------- UTILS DE MAPPING -----------------
function mapEnum<T extends string>(value: unknown, valid: T[]): T | null {
  if (typeof value !== "string") return null;
  return valid.includes(value as T) ? (value as T) : null;
}

function mapDate(value: unknown): string | undefined {
  return value instanceof Date ? value.toISOString() : undefined;
}

function mapNullable<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

// ----------------- MAPPER VEHICULE -----------------
const validStatuses: VehiculeStatus[] = ["Disponible", "Maintenance", "Incident"];

function mapDepenseFromPrisma(dep: {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  km: number;
  vehiculeId: number;
  itemId: number | null;
  categorie: string;
  montant: number;
  note: string | null;
  reparation: string | null;
  date: Date;
  intervenant: string | null;
}): Depense {
  return {
    id: dep.id,
    createdAt: dep.createdAt.toISOString(),
    updatedAt: dep.updatedAt.toISOString(),
    km: dep.km,
    vehiculeId: dep.vehiculeId,
    itemId: dep.itemId ?? 0,
    categorie: dep.categorie,
    montant: dep.montant,
    note: dep.note ?? "",
    reparation: dep.reparation ?? "",
    date: dep.date.toISOString(),
    intervenant: dep.intervenant ?? "",
  };
}

function mapVehiculeFromPrisma(vehicleRaw: {
  id: number;
  type: string;
  constructeur: string;
  modele: string;
  annee: number;
  energie: string;
  km: number;
  statut: string | null;
  prixAchat: number | null;
  dateEntretien: Date | null;
  prochaineRevision: Date | null;
  ctValidite: Date | null;
  immat: string;
  vim: string | null;
  places: number | null;
  motorisation: string | null;
  chevauxFiscaux: number | null;
  depense?: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    km: number;
    vehiculeId: number;
    itemId: number | null;
    categorie: string;
    montant: number;
    note: string | null;
    reparation: string | null;
    date: Date;
    intervenant: string | null;
  }[];
}): Vehicule {
  return {
    id: vehicleRaw.id,
    type: vehicleRaw.type,
    constructeur: vehicleRaw.constructeur,
    modele: vehicleRaw.modele,
    annee: vehicleRaw.annee,
    energie: vehicleRaw.energie,
    km: vehicleRaw.km,
    immat: vehicleRaw.immat,
    statut: mapEnum(vehicleRaw.statut, validStatuses),
    prixAchat: mapNullable(vehicleRaw.prixAchat),
    dateEntretien: mapDate(vehicleRaw.dateEntretien) ?? "",
    prochaineRevision: mapDate(vehicleRaw.prochaineRevision) ?? "",
    ctValidite: mapDate(vehicleRaw.ctValidite) ?? "",
    vim: mapNullable(vehicleRaw.vim),
    places: mapNullable(vehicleRaw.places),
    motorisation: mapNullable(vehicleRaw.motorisation),
    chevauxFiscaux: mapNullable(vehicleRaw.chevauxFiscaux),
    depense: vehicleRaw.depense?.map(mapDepenseFromPrisma) ?? [],
  };
}
// ----------------- MAPPER PARAMETRES -----------------
function mapParametresFromPrisma(d: {
  id: number;
  itemId: number | null;
  type: string;
  category: string | null;
  subCategory: string | null;
  seuilKm: number;
  alertKmBefore: number | null;
  description: string | null;
  applicableTo: string | null;
}): ParametreEntretien {
  // Définir les catégories valides
  const validCategories: ParametreEntretien["category"][] = [
    "Mécanique",
    "Révision générale",
    "Carrosserie",
  ];

  // Vérifier si la catégorie est valide et la typer correctement
  const category: ParametreEntretien["category"] =
    d.category && validCategories.includes(d.category as ParametreEntretien["category"])
      ? (d.category as ParametreEntretien["category"])
      : "Mécanique"; // fallback si invalide

  // Transformer applicableTo en tableau typé
  let applicableTo: VehicleType[] = [];
  if (d.applicableTo) {
    try {
      const parsed = JSON.parse(d.applicableTo);
      if (Array.isArray(parsed)) {
        applicableTo = parsed as VehicleType[];
      }
    } catch {
      applicableTo = [];
    }
  }

  return {
    id: d.id,
    itemId: d.itemId ?? 0,
    type: d.type,
    category,
    subCategory: d.subCategory ?? undefined,
    seuilKm: d.seuilKm,
    alertKmBefore: d.alertKmBefore ?? undefined,
    description: d.description ?? undefined,
    applicableTo,
  };
}

// ----------------- ENDPOINT ----------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const vehicleId = body.vehicleId as number | undefined;

    const vehiclesRaw = vehicleId
      ? await prisma.vehicule.findMany({
          where: { id: vehicleId },
          include: { depense: true },
        })
      : await prisma.vehicule.findMany({ include: { depense: true } });

    if (!vehiclesRaw || vehiclesRaw.length === 0) {
      return NextResponse.json(
        { error: vehicleId ? "Vehicle not found" : "No vehicles available" },
        { status: vehicleId ? 404 : 200 },
      );
    }

    const paramsRaw = await prisma.entretienParam.findMany();
    const params: ParametreEntretien[] = paramsRaw.map(mapParametresFromPrisma);

    const notifications: any[] = [];

    for (const vehicleRaw of vehiclesRaw) {
      const vehicle: Vehicule = mapVehiculeFromPrisma(vehicleRaw);
      const generated = generateAllNotifications([vehicle], params);
      const existing = await prisma.notification.findMany({ where: { vehicleId: vehicle.id } });

      // Supprimer notifications obsolètes
      for (const notif of existing) {
        const stillExists = generated.some(
          (g) =>
            g.type === notif.type &&
            g.vehicleId === notif.vehicleId &&
            g.itemId === notif.itemId &&
            g.message === notif.message,
        );
        if (!stillExists) {
          await prisma.notification.deleteMany({ where: { id: notif.id } });
          broadcastRemoveNotification(notif.itemId ?? 0, notif.vehicleId, notif.type);
        }
      }

      // Ajouter nouvelles notifications
      for (const g of generated) {
        const exists = existing.find(
          (n) =>
            n.type === g.type &&
            n.vehicleId === g.vehicleId &&
            n.itemId === g.itemId &&
            n.message === g.message,
        );
        if (!exists) {
          const created = await prisma.notification.create({
            data: {
              type: g.type,
              message: g.message,
              vehicleId: g.vehicleId,
              itemId: g.itemId,
              priority: g.priority,
              date: g.date,
              km: g.km,
              seen: g.seen,
            },
          });

          broadcastNotification({
            ...created,
            createdAt: created.createdAt.toISOString(),
          });
        }
      }

      const vehicleNotifs = await prisma.notification.findMany({
        where: { vehicleId: vehicle.id },
        orderBy: { date: "asc" },
      });

      notifications.push(...vehicleNotifs);
    }

    return NextResponse.json({ success: true, notifications });
  } catch (err) {
    console.error("POST /notifications/refresh error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
