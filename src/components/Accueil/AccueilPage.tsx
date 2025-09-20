// pages/accueil.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicule } from "@/types/vehicule";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface Conducteur {
    id: number;
    nom: string;
    prenom: string;
}

interface Trajet {
    id: number;
    vehiculeId: number;
    conducteurId: number | null;
    kmDepart: number | null;
    kmArrivee: number | null;
    heureDepart?: string;
    heureArrivee?: string;
    destination?: string;
}

const AccueilPage = () => {
    const [vehicules, setVehicules] = useState<Vehicule[]>([]);
    const [conducteurs, setConducteurs] = useState<Conducteur[]>([]);
    const [trajets, setTrajets] = useState<Trajet[]>([]);
    const router = useRouter();

    useEffect(() => {
        const mockVehicules: Vehicule[] = [
            { id: 1, type: "Voiture", modele: "Clio", energie: "Essence", immat: "AB-123-CD", statut: "Disponible", km: 12000 },
            { id: 2, type: "Camion", modele: "Master", energie: "Diesel", immat: "EF-456-GH", statut: "Occupé", km: 55000 },
        ];
        setVehicules(mockVehicules);

        const mockConducteurs: Conducteur[] = [
            { id: 1, nom: "Dupont", prenom: "Paul" },
            { id: 2, nom: "Martin", prenom: "Julie" },
        ];
        setConducteurs(mockConducteurs);

        const mockTrajets: Trajet[] = [
            { id: 1, vehiculeId: 1, conducteurId: 1, kmDepart: 12000, kmArrivee: 12150, heureDepart: "08:00", heureArrivee: "10:30", destination: "Paris" },
            { id: 2, vehiculeId: 2, conducteurId: null, kmDepart: null, kmArrivee: null, heureDepart: "", heureArrivee: "", destination: "" },
        ];
        setTrajets(mockTrajets);
    }, []);

    const getEtatVehicule = (vehiculeId: number) => {
        const trajet = trajets.find(t => t.vehiculeId === vehiculeId);
        if (!trajet || !trajet.conducteurId) return { label: "Aucun conducteur", icon: <XCircle className="h-5 w-5 text-red-600" /> };
        const infosManquantes = !trajet.kmDepart || !trajet.kmArrivee || !trajet.heureDepart || !trajet.heureArrivee || !trajet.destination;
        if (infosManquantes) return { label: "Infos manquantes", icon: <AlertCircle className="h-5 w-5 text-yellow-600" /> };
        return { label: "Complet", icon: <CheckCircle2 className="h-5 w-5 text-green-600" /> };
    };

    const calculerDuree = (heureDepart?: string, heureArrivee?: string) => {
        if (!heureDepart || !heureArrivee) return null;
        const [hdH, hdM] = heureDepart.split(":").map(Number);
        const [haH, haM] = heureArrivee.split(":").map(Number);
        let diff = (haH * 60 + haM) - (hdH * 60 + hdM);
        if (diff < 0) diff += 24 * 60;
        const heures = Math.floor(diff / 60);
        const minutes = diff % 60;
        return `${heures}h ${minutes.toString().padStart(2, "0")}m`;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">🚘 Suivi des véhicules & trajets</h1>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {["Type","Modèle","Énergie","Immatriculation","Km total","Conducteur","Destination","Km départ","Km arrivée","Heure départ","Heure arrivée","Durée","État"].map(t => (
                            <th key={t} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 tracking-wider">{t}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {vehicules.map(v => {
                        const trajet = trajets.find(t => t.vehiculeId === v.id);
                        const conducteur = conducteurs.find(c => c.id === trajet?.conducteurId);
                        const etat = getEtatVehicule(v.id);
                        const duree = calculerDuree(trajet?.heureDepart, trajet?.heureArrivee);
                        return (
                            <tr key={v.id} onClick={() => router.push(`/details-trajet/${v.id}`)} className="cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out">
                                <td className="px-4 py-3 text-sm text-gray-700">{v.type}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{v.modele}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{v.energie}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{v.immat}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{v.km.toLocaleString()} km</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{conducteur ? `${conducteur.prenom} ${conducteur.nom}` : <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{trajet?.destination || <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{trajet?.kmDepart ?? <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{trajet?.kmArrivee ?? <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{trajet?.heureDepart || <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{trajet?.heureArrivee || <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{duree || <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3 text-sm flex items-center gap-2">{etat.icon}<span>{etat.label}</span></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccueilPage;