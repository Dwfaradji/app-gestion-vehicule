// "use client";
//
// import { useMemo } from "react";
// import type { Trajet } from "@/types/trajet";
// import { Truck, Droplet, MapPin, Clock } from "lucide-react";
// import type { LucideIcon } from "lucide-react";
//
// export interface Stat {
//     id: string;
//     label: string;
//     value: number | string;
//     color: string;
//     Icon: LucideIcon;
// }
//
// interface TotalTrajetsProps {
//     trajets: Trajet[];
// }
//
// /**
//  * Calcule et retourne les statistiques des trajets.
//  * (Ne rend rien dans le DOM)
//  */
// export default function useTotalTrajets({ trajets }: TotalTrajetsProps): Stat[] {
//     return useMemo(() => {
//         const totalTrajets = trajets.length;
//
//         const totalKm = trajets.reduce(
//             (acc, t) => acc + (t.kmArrivee && t.kmDepart ? t.kmArrivee - t.kmDepart : 0),
//             0
//         );
//
//         const totalCarburant = trajets.reduce((acc, t) => acc + (t.carburant ?? 0), 0);
//
//         const totalMinutes = trajets.reduce((acc, t) => {
//             if (!t.heureDepart || !t.heureArrivee) return acc;
//             const [hdH, hdM] = t.heureDepart.split(":").map(Number);
//             const [haH, haM] = t.heureArrivee.split(":").map(Number);
//             let diff = haH * 60 + haM - (hdH * 60 + hdM);
//             if (diff < 0) diff += 24 * 60;
//             return acc + diff;
//         }, 0);
//
//         const totalDuree = `${Math.floor(totalMinutes / 60)}h ${String(
//             totalMinutes % 60
//         ).padStart(2, "0")}m`;
//
//         // Trajets par jour pour calculer la moyenne
//         const trajetsParJourMap: Record<string, number> = {};
//         trajets.forEach((t) => {
//             if (!t.createdAt) return;
//             const day = new Date(t.createdAt).toLocaleDateString();
//             trajetsParJourMap[day] = (trajetsParJourMap[day] || 0) + 1;
//         });
//
//         const moyenneTrajetsParJour =
//             Object.keys(trajetsParJourMap).length > 0
//                 ? (totalTrajets / Object.keys(trajetsParJourMap).length).toFixed(1)
//                 : "0";
//
//         return [
//             {
//                 id: "totalTrajets",
//                 label: "Trajets effectués",
//                 value: totalTrajets,
//                 color: "bg-blue-100 text-blue-700",
//                 Icon: MapPin,
//             },
//             {
//                 id: "moyTrajets",
//                 label: "Moyenne/jour",
//                 value: moyenneTrajetsParJour,
//                 color: "bg-green-100 text-green-700",
//                 Icon: Clock,
//             },
//             {
//                 id: "totalKm",
//                 label: "Km total",
//                 value: totalKm,
//                 color: "bg-purple-100 text-purple-700",
//                 Icon: Truck,
//             },
//             {
//                 id: "totalCarburant",
//                 label: "Litre carburant",
//                 value: totalCarburant,
//                 color: "bg-red-100 text-red-700",
//                 Icon: Droplet,
//             },
//             {
//                 id: "totalDuree",
//                 label: "Durée totale",
//                 value: totalDuree,
//                 color: "bg-yellow-100 text-yellow-700",
//                 Icon: Clock,
//             },
//         ];
//     }, [trajets]);
// }