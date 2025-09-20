// types/entretien.ts
import {VehicleType} from "@/data/maintenanceParams";

export interface ParametreEntretien {
    id: number;
    itemId: number;
    type: string;
    category: "Mécanique" | "Révision générale"| "Carrosserie";
    subCategory?: string;
    seuilKm: number;
    alertKmBefore?: number;
    description?: string;
    applicableTo?: VehicleType[];
}
export interface Notification {
    id?: number;             // optionnel (géré par la DB)
    type: string;
    message: string;
    vehicleId: number;
    itemId?: number;
    date?: string;
    km?: number;
    seen: boolean;
    priority: string;
    createdAt?: string;
}

export interface Email {
    id: number;
    adresse: string;
    date: string;
    status: "PENDING" | "SENT" | "FAILED";
    from: string;
    to: string;
    subject: string;
    body: string;
}

export interface Item {
    itemId: number;
    id?: number;
    montant: number;
    categorie: string;           // Mécanique, Carrosserie, Entretien, Dépenses
    reparation: string;    // nom de l’intervention
    date: string;           // date de réalisation
    km: number;             // km lors de l’intervention ou montant (€) pour dépense
    intervenant: string;    // qui a fait l’intervention
    note?: string;          // note optionnelle
}
