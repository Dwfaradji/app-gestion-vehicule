'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Vehicule } from "@/types/vehicule";
import { Notification } from "@/types/entretien";
import QRCode from "react-qr-code";

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
    date?: string;
    anomalies?: string;
    _new?: boolean;
}

interface DetailTrajetProps {
    vehicules: Vehicule[];
    conducteurs: Conducteur[];
}

const DetailTrajetPage = ({ vehicules, conducteurs }: DetailTrajetProps) => {
    const router = useRouter();
    const params = useParams();
    const vehiculeId = params?.id ? Number(params.id) : null;

    const [trajets, setTrajets] = useState<Trajet[]>([]);
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    // Charger mock trajets et QR Code
    useEffect(() => {
        if (!vehiculeId) return;

        const mockTrajets: Trajet[] = [
            {
                id: 1,
                vehiculeId,
                conducteurId: 1,
                kmDepart: 12000,
                kmArrivee: 12150,
                heureDepart: "08:00",
                heureArrivee: "10:30",
                destination: "Paris",
                date: new Date().toISOString(),
                anomalies: "",
                _new: false,
            },
        ];

        setTrajets(mockTrajets);

        // QR Code fixe pour le véhicule
        setQrCodeUrl(`${window.location.origin}/formulaire-trajet?vehiculeId=${vehiculeId}`);
    }, [vehiculeId]);

    const vehicule = vehicules.find(v => v.id === vehiculeId);

    const handleChange = (trajetId: number, field: keyof Trajet, value: any) => {
        setTrajets(prev =>
            prev.map(t => (t.id === trajetId ? { ...t, [field]: value } : t))
        );
    };

    const handleAjouterTrajet = () => {
        const newTrajet: Trajet = {
            id: Date.now(),
            vehiculeId: vehiculeId!,
            conducteurId: null,
            kmDepart: null,
            kmArrivee: null,
            heureDepart: "",
            heureArrivee: "",
            destination: "",
            anomalies: "",
            date: new Date().toISOString(),
            _new: true,
        };
        setTrajets(prev => [...prev, newTrajet]);
    };

    const handleSupprimerTrajet = (trajetId: number) => {
        setTrajets(prev => prev.filter(t => t.id !== trajetId));
    };

    const handleEnregistrerTrajets = () => {
        console.log("Trajets sauvegardés :", trajets);
        alert("Trajets enregistrés avec succès !");
        // Ici tu peux appeler ton API pour sauvegarder les trajets
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Détails du véhicule & trajets</h1>

            {vehicule && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">{vehicule.type} - {vehicule.modele}</h2>
                        <p>Immatriculation: {vehicule.immat}</p>
                        <p>Énergie: {vehicule.energie}</p>
                    </div>
                    {qrCodeUrl && <QRCode value={qrCodeUrl} size={100} />}
                </div>
            )}

            <div className="flex gap-2 mb-4">
                <button
                    onClick={handleAjouterTrajet}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Ajouter un trajet
                </button>
                <button
                    onClick={handleEnregistrerTrajets}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Enregistrer tous les trajets
                </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {["Conducteur","Destination","Km départ","Km arrivée","Heure départ","Heure arrivée","Anomalies","Date","Actions"].map(t => (
                            <th key={t} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{t}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {trajets.map(t => {
                        const conducteur = conducteurs.find(c => c.id === t.conducteurId);

                        return (
                            <tr key={t.id} className="transition hover:bg-blue-50">
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <select
                                        value={t.conducteurId || ""}
                                        onChange={(e) => handleChange(t.id, "conducteurId", Number(e.target.value))}
                                        className="border rounded px-2 py-1 w-full"
                                    >
                                        <option value="">Sélectionner</option>
                                        {conducteurs.map(c => (
                                            <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <input value={t.destination || ""} onChange={e => handleChange(t.id, 'destination', e.target.value)} className="w-full border rounded px-2 py-1"/>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <input type="number" value={t.kmDepart ?? ""} onChange={e => handleChange(t.id,'kmDepart',Number(e.target.value))} className="w-full border rounded px-2 py-1"/>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <input type="number" value={t.kmArrivee ?? ""} onChange={e => handleChange(t.id,'kmArrivee',Number(e.target.value))} className="w-full border rounded px-2 py-1"/>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <input type="time" value={t.heureDepart || ""} onChange={e => handleChange(t.id,'heureDepart',e.target.value)} className="w-full border rounded px-2 py-1"/>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <input type="time" value={t.heureArrivee || ""} onChange={e => handleChange(t.id,'heureArrivee',e.target.value)} className="w-full border rounded px-2 py-1"/>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <input value={t.anomalies || ""} onChange={e => handleChange(t.id,'anomalies',e.target.value)} placeholder="Signaler une anomalie" className="w-full border rounded px-2 py-1"/>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">{t.date ? new Date(t.date).toLocaleDateString() : "-"}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    <button onClick={() => handleSupprimerTrajet(t.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Supprimer</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailTrajetPage;