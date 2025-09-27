"use client";

import { Trajet, useTrajets } from "@/context/trajetsContext";
import { useState, useEffect } from "react";
import { Edit2, Save, Trash, X, Plus, Download } from "lucide-react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { Vehicule } from "@/types/vehicule";
import FormulaireTrajet from "@/components/Accueil/FormulaireTrajet";

export default function DetailTrajetPage({ vehicules }: { vehicules: Vehicule[] }) {
    const params = useParams();
    const vehiculeId = params?.id ? Number(params.id) : null;

    const { trajets, conducteurs, addTrajet, deleteTrajet, updateTrajet } = useTrajets();
    const [vehiculeTrajets, setVehiculeTrajets] = useState<Trajet[]>([]);
    const [editingTrajets, setEditingTrajets] = useState<number[]>([]);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [activeTrajetId, setActiveTrajetId] = useState<number | null>(null);

    const vehicule = vehicules.find(v => v.id === vehiculeId);

    useEffect(() => {
        if (!vehiculeId) return;
        setVehiculeTrajets(trajets.filter(t => t.vehiculeId === vehiculeId));
        setQrCodeUrl(`${window.location.origin}/formulaire-trajet?vehiculeId=${vehiculeId}`);
    }, [trajets, vehiculeId]);

    const handleAjouterTrajet = () => {
        if (!vehiculeId) return;
        const newId = Date.now();
        const newTrajet: Trajet = {
            id: newId,
            vehiculeId,
            conducteurId: null,
            kmDepart: null,
            kmArrivee: null,
            destination: "",
            anomalies: [],
            carburant: 0,
            date: new Date().toISOString(),
            heureDepart: "",
            heureArrivee: ""
        };
        setVehiculeTrajets(prev => [...prev, newTrajet]);
        setEditingTrajets(prev => [...prev, newId]);
    };

    const handleChange = (trajetId: number, field: keyof Trajet | "newAnomalie", value: any) => {
        setVehiculeTrajets(prev => prev.map(t => t.id === trajetId ? { ...t, [field]: value } : t));
    };

    const handleSave = async (trajetId: number) => {
        const trajet = vehiculeTrajets.find(t => t.id === trajetId);
        if (!trajet?.conducteurId) { alert("Veuillez sélectionner un conducteur"); return; }

        const anomalies = Array.from(new Set(trajet.anomalies ?? []));
        if ((trajet as any).newAnomalie?.trim()) anomalies.push((trajet as any).newAnomalie.trim());

        try {
            if (trajets.find(t => t.id === trajetId)) {
                await updateTrajet({ ...trajet, anomalies, newAnomalie: undefined });
            } else {
                await addTrajet({ ...trajet, anomalies, newAnomalie: undefined });
            }
            setEditingTrajets(prev => prev.filter(id => id !== trajetId));
        } catch (err) { console.error(err); alert("Erreur serveur"); }
    };

    const handleDownloadQRCode = () => {
        if (!qrCodeUrl || !vehicule) return;
        const svg = document.getElementById("qrCode") as SVGSVGElement;
        if (!svg) return;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            ctx?.drawImage(img, 0, 0);
            const link = document.createElement("a");
            link.download = `QR_Vehicule_${vehicule.immat}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Détails du véhicule & trajets</h1>

            {vehicule && (
                <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-6 rounded-3xl shadow-2xl border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-wider">{vehicule.type} - {vehicule.modele}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-sm">
                            <p><strong>Immatriculation:</strong> {vehicule.immat}</p>
                            <p className="flex items-center gap-1"><strong>Énergie:</strong> {vehicule.energie}</p>
                            <p className="flex items-center gap-1"><strong>Places:</strong> {vehicule.places}</p>
                            <p className="flex items-center gap-1"><strong>Boîte:</strong> {vehicule.boite || "Automatique"}</p>
                            <p className="flex items-center gap-1"><strong>Mise en circulation:</strong> {vehicule.miseEnCirculation ? new Date(vehicule.miseEnCirculation).toLocaleDateString() : "N/A"}</p>
                            <p className="flex items-center gap-1"><strong>Trajets:</strong> {vehiculeTrajets.length}</p>
                        </div>
                        <span className={`mt-2 px-3 py-1 w-max rounded-full text-sm font-semibold ${vehiculeTrajets.length === 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {vehiculeTrajets.length === 0 ? "Disponible" : "En usage"}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        {qrCodeUrl && <QRCode id="qrCode" value={qrCodeUrl} size={140} className="p-2 bg-white rounded-xl shadow-lg"/>}
                        <button onClick={handleDownloadQRCode} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 shadow-lg transition">Télécharger QR</button>
                    </div>
                </div>
            )}

            <div className="mb-4 flex justify-end">
                <button onClick={handleAjouterTrajet} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1">Ajouter un trajet</button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {["Conducteur","Destination","Km départ","Km arrivée","Heure départ","Heure arrivée","Carburant","Anomalies","Date","Actions"].map(t => <th key={t} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{t}</th>)}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {vehiculeTrajets.map(trajet => {
                        const isEditing = editingTrajets.includes(trajet.id);
                        return (
                            <tr key={trajet.id} className="hover:bg-blue-50">
                                <td>{isEditing ? (
                                    <select value={trajet.conducteurId || ""} onChange={e => handleChange(trajet.id, "conducteurId", Number(e.target.value))}>
                                        <option value="">Sélectionner</option>
                                        {conducteurs.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                                    </select>
                                ) : (conducteurs.find(c => c.id === trajet.conducteurId)?.prenom + " " + conducteurs.find(c => c.id === trajet.conducteurId)?.nom)}</td>
                                <td><input type="text" value={trajet.destination || ""} disabled={!isEditing} onChange={e => handleChange(trajet.id, "destination", e.target.value)} className="w-full"/></td>
                                <td><input type="number" value={trajet.kmDepart ?? ""} disabled={!isEditing} onChange={e => handleChange(trajet.id, "kmDepart", Number(e.target.value))} className="w-full"/></td>
                                <td><input type="number" value={trajet.kmArrivee ?? ""} disabled={!isEditing} onChange={e => handleChange(trajet.id, "kmArrivee", Number(e.target.value))} className="w-full"/></td>
                                <td><input type="time" value={trajet.heureDepart || ""} disabled={!isEditing} onChange={e => handleChange(trajet.id, "heureDepart", e.target.value)} className="w-full"/></td>
                                <td><input type="time" value={trajet.heureArrivee || ""} disabled={!isEditing} onChange={e => handleChange(trajet.id, "heureArrivee", e.target.value)} className="w-full"/></td>
                                <td><input type="number" value={trajet.carburant ?? 0} disabled={!isEditing} onChange={e => handleChange(trajet.id, "carburant", Number(e.target.value))} className="w-full"/></td>
                                <td>
                                    {Array.from(new Set(trajet.anomalies || [])).map((a, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            {a}
                                            {isEditing && <button onClick={() => { const updated = [...trajet.anomalies!]; updated.splice(i,1); handleChange(trajet.id,"anomalies",updated) }}><X size={12}/></button>}
                                        </div>
                                    ))}
                                </td>
                                <td>{trajet.date ? new Date(trajet.date).toLocaleDateString() : "-"}</td>
                                <td className="flex gap-1">
                                    {isEditing ? (
                                        <button onClick={()=>handleSave(trajet.id)} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1">Enregistrer</button>
                                    ) : (
                                        <>
                                            <button onClick={()=>setEditingTrajets(prev=>[...prev,trajet.id])} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1">Modifier</button>
                                            <button onClick={()=>setActiveTrajetId(trajet.id)} className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 flex items-center gap-1">Ouvrir Formulaire</button>
                                        </>
                                    )}
                                    <button onClick={()=>deleteTrajet(trajet.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center gap-1">Supprimer</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* ✅ Formulaire Trajet Modal */}
            {activeTrajetId !== null && vehicule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setActiveTrajetId(null)}
                            className="absolute top-4 right-4 text-red-600 font-bold text-xl"
                        >
                            X
                        </button>
                        <FormulaireTrajet
                            vehicule={vehicule}
                            conducteur={conducteurs.find(c => c.id === vehiculeTrajets.find(t => t.id === activeTrajetId)?.conducteurId)}
                            trajetId={activeTrajetId}
                            onSubmit={(data) => updateTrajet(data)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}