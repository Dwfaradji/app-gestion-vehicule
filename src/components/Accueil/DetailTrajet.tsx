"use client";

import {useTrajets} from "@/context/trajetsContext";
import {useState, useEffect} from "react";
import {Edit2, Plus, Save, Trash} from "lucide-react";
import {useParams} from "next/navigation";
import QRCode from "react-qr-code";
import {Vehicule} from "@/types/vehicule";
import FormulaireTrajet from "@/components/Accueil/FormulaireTrajet";
import {Trajet} from "@/types/trajet";
import {AnomaliesCell} from "@/components/Accueil/AnomaliesCell";
import {motion, AnimatePresence} from "framer-motion";
import {Car, Fuel, Users, MapPin, Droplet, CheckCircle2} from "lucide-react";

import {useSpring, animated} from "@react-spring/web";


export function DetailTrajetPage({vehicules}: { vehicules: Vehicule[] }) {
    const params = useParams();
    const vehiculeId = params?.id ? Number(params.id) : null;

    const {trajets, conducteurs, addTrajet, deleteTrajet, updateTrajet} = useTrajets();
    const [vehiculeTrajets, setVehiculeTrajets] = useState<Trajet[]>([]);
    const [editingTrajets, setEditingTrajets] = useState<number[]>([]);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [activeTrajetId, setActiveTrajetId] = useState<number | null>(null);

    const vehicule = vehicules.find(v => v.id === vehiculeId);
    const [dernierCarburant, setDernierCarburant] = useState<number>(100);

    useEffect(() => {
        if (!vehiculeId) return;

        const trajetsVehicule = trajets
            .filter(t => t.vehiculeId === vehiculeId)
            .sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));

        setVehiculeTrajets(trajetsVehicule);
        setQrCodeUrl(`${window.location.origin}/formulaire-trajet/${vehiculeId}`);

        setDernierCarburant(trajetsVehicule[0]?.carburant ?? 100);
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
            createdAt: new Date().toISOString(),
            heureDepart: "",
            heureArrivee: ""
        };
        setVehiculeTrajets(prev => [...prev, newTrajet]);
        setEditingTrajets(prev => [...prev, newId]);
    };

    type TrajetField = keyof Trajet | "newAnomalie";
    type TrajetFieldValue = string | number | string[] | null;

    const handleChange = (trajetId: number, field: TrajetField, value: TrajetFieldValue) => {
        setVehiculeTrajets(prev => prev.map(t => t.id === trajetId ? {...t, [field]: value} : t));
    };

    const handleSave = async (trajetId: number) => {
        const trajet = vehiculeTrajets.find(t => t.id === trajetId);

        if (!trajet?.conducteurId) {
            // Supprime le trajet localement si aucun conducteur
            setVehiculeTrajets(prev => prev.filter(t => t.id !== trajetId));
            setEditingTrajets(prev => prev.filter(id => id !== trajetId));
            return alert("Trajet supprimé car aucun conducteur sélectionné.");
        }

        const anomaliesFinales = Array.from(new Set(trajet.anomalies ?? []));

        try {
            if (trajets.find(t => t.id === trajetId)) {
                await updateTrajet({...trajet, anomalies: anomaliesFinales});
            } else {
                await addTrajet({...trajet, anomalies: anomaliesFinales});
            }
            setEditingTrajets(prev => prev.filter(id => id !== trajetId));
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    };

    const handleDelete = async (trajetId: number) => {
        const existsInContext = trajets.find(t => t.id === trajetId);

        if (existsInContext) {
            try {
                await deleteTrajet(trajetId);
            } catch (err) {
                console.error(err);
                return alert("Erreur serveur lors de la suppression du trajet.");
            }
        }

        // Suppression locale avec animation
        setVehiculeTrajets(prev => prev.filter(t => t.id !== trajetId));
        setEditingTrajets(prev => prev.filter(id => id !== trajetId));
    };

    const handleDownloadQRCode = () => {
        if (!qrCodeUrl || !vehicule) return;

        const svg = document.getElementById("qrCode") as unknown as SVGSVGElement;
        if (!svg) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            const padding = 40;
            const textHeight = 50;
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2 + textHeight;

            if (!ctx) return;

            // Fond arrondi avec dégradé
            const radius = 30;
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, "#e0f2ff");
            gradient.addColorStop(1, "#ffffff");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(canvas.width - radius, 0);
            ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
            ctx.lineTo(canvas.width, canvas.height - radius);
            ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
            ctx.lineTo(radius, canvas.height);
            ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.fill();

            // Ombre douce pour le QR code
            ctx.shadowColor = "rgba(0,0,0,0.15)";
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 5;

            // Dessiner QR code centré
            ctx.drawImage(img, padding, padding, img.width, img.height);

            // Réinitialiser ombre pour texte
            ctx.shadowColor = "transparent";

            // Texte immatriculation
            ctx.fillStyle = "#1e3a8a"; // bleu foncé
            ctx.font = "bold 26px Arial";
            ctx.textAlign = "center";
            ctx.fillText(vehicule.immat, canvas.width / 2, img.height + padding + 30);

            // URL du formulaire
            ctx.font = "16px Arial";
            ctx.fillStyle = "#374151"; // gris foncé
            ctx.fillText(qrCodeUrl, canvas.width / 2, img.height + padding + 55);

            // Télécharger l'image
            const link = document.createElement("a");
            link.download = `QR_Vehicule_${vehicule.immat}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };

        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    };
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Détails des Trajets du véhicule</h1>

            {vehicule && (
                <div
                    className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-8 rounded-3xl shadow-2xl border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 transition-transform hover:scale-[1.01] duration-300">

                    {/* Infos principales */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-wide">
                            {vehicule.type} - {vehicule.modele}
                        </h2>

                        {/* Mini-cards infos */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
                            {[
                                {label: "Immatriculation", value: vehicule.immat, icon: Car, color: "blue"},
                                {label: "Énergie", value: vehicule.energie, icon: Fuel, color: "green"},
                                {label: "Places", value: vehicule.places, icon: Users, color: "purple"},
                                {label: "Trajets", value: vehiculeTrajets.length, icon: MapPin, color: "yellow"},
                                {
                                    label: "Carburant",
                                    value: dernierCarburant,
                                    icon: Droplet,
                                    color: "red",
                                    isAnimated: true
                                },
                                {
                                    label: "Statut",
                                    value: vehiculeTrajets.length === 0 ? "Disponible" : "En usage",
                                    icon: CheckCircle2,
                                    color: vehiculeTrajets.length === 0 ? "green" : "yellow"
                                },
                            ].map((item, idx) => {
                                const Icon = item.icon;

                                // Animation du pourcentage de carburant
                                const springProps = item.isAnimated ? useSpring({
                                    number: item.value,
                                    from: {number: 0},
                                    config: {duration: 1000}
                                }) : null;

                                return (
                                    <div
                                        key={idx}
                                        className={`bg-${item.color}-50 p-4 rounded-xl shadow-md flex items-center gap-3 transform transition hover:scale-105 hover:shadow-lg duration-300 cursor-pointer`}
                                    >
                                        <Icon className={`text-${item.color}-600`} size={24}/>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-xs font-medium">{item.label}</span>
                                            {item.isAnimated ? (
                                                <animated.span className="font-semibold text-gray-900">
                                                    {springProps?.number.to(n => `${Math.round(n)}%`)}
                                                </animated.span>
                                            ) : (
                                                <span className="font-semibold text-gray-900">{item.value}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* QR Code et bouton */}
                    <div className="flex flex-col items-center gap-4">
                        {qrCodeUrl && (
                            <div
                                className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 transform transition hover:scale-105 duration-300">
                                <QRCode id="qrCode" value={qrCodeUrl} size={160}/>
                            </div>
                        )}
                        <button
                            onClick={handleDownloadQRCode}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105 font-medium"
                        >
                            Télécharger QR
                        </button>
                    </div>

                </div>
            )}
            <div className="mb-4 flex justify-end">
                <button
                    onClick={handleAjouterTrajet}
                    className="
      flex items-center gap-2
      bg-gradient-to-r from-green-500 to-green-600
      text-white font-semibold
      px-5 py-2 rounded-xl
      shadow-lg
      hover:from-green-600 hover:to-green-700
      hover:shadow-2xl
      transition-all duration-300
      transform hover:-translate-y-1
      focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
      relative overflow-hidden
    "
                >
                    <Plus
                        size={18}
                        className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125"
                    />
                    Ajouter un trajet
                    <span className="absolute inset-0 bg-green-50 opacity-0 hover:opacity-10 rounded-xl transition-opacity duration-300"></span>
                </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {["Conducteur", "Destination", "Km départ", "Km arrivée", "Heure départ", "Heure arrivée", "Carburant", "Anomalies", "Date", "Actions"].map(t =>
                            <th key={t}
                                className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{t}</th>
                        )}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                        {vehiculeTrajets.map(trajet => {
                            const isEditing = editingTrajets.includes(trajet.id);
                            const conducteur = conducteurs.find(c => c.id === trajet.conducteurId);

                            return (
                                <motion.tr
                                    key={trajet.id}
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, x: -50, scale: 0.95}}
                                    transition={{duration: 0.2}}
                                    className="hover:bg-blue-50 transition-colors duration-200 even:bg-gray-50"
                                >
                                    {/* Conducteur */}
                                    <td className="px-2 py-1">
                                        {isEditing ? (
                                            <select value={trajet.conducteurId || ""}
                                                    onChange={e => handleChange(trajet.id, "conducteurId", Number(e.target.value))}
                                                    className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500">
                                                <option value="">Sélectionner</option>
                                                {conducteurs.map(c => <option key={c.id}
                                                                              value={c.id}>{c.prenom} {c.nom}</option>)}
                                            </select>
                                        ) : (conducteur ? `${conducteur.prenom} ${conducteur.nom}` : "-")}
                                    </td>

                                    {/* Destination */}
                                    <td className="px-2 py-1">
                                        <input type="text" value={trajet.destination || ""} disabled={!isEditing}
                                               onChange={e => handleChange(trajet.id, "destination", e.target.value)}
                                               className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"/>
                                    </td>

                                    {/* Km départ / Km arrivée */}
                                    <td className="px-2 py-1"><input type="number" value={trajet.kmDepart ?? ""}
                                                                     disabled={!isEditing}
                                                                     onChange={e => handleChange(trajet.id, "kmDepart", Number(e.target.value))}
                                                                     className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"/>
                                    </td>
                                    <td className="px-2 py-1"><input type="number" value={trajet.kmArrivee ?? ""}
                                                                     disabled={!isEditing}
                                                                     onChange={e => handleChange(trajet.id, "kmArrivee", Number(e.target.value))}
                                                                     className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"/>
                                    </td>

                                    {/* Heures */}
                                    <td className="px-2 py-1"><input type="time" value={trajet.heureDepart || ""}
                                                                     disabled={!isEditing}
                                                                     onChange={e => handleChange(trajet.id, "heureDepart", e.target.value)}
                                                                     className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"/>
                                    </td>
                                    <td className="px-2 py-1"><input type="time" value={trajet.heureArrivee || ""}
                                                                     disabled={!isEditing}
                                                                     onChange={e => handleChange(trajet.id, "heureArrivee", e.target.value)}
                                                                     className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"/>
                                    </td>

                                    {/* Carburant */}
                                    <td className="px-2 py-1"><input type="number" value={trajet.carburant ?? 0}
                                                                     disabled={!isEditing}
                                                                     onChange={e => handleChange(trajet.id, "carburant", Number(e.target.value))}
                                                                     className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"/>
                                    </td>

                                    {/* Anomalies */}
                                    <td className="px-2 py-1 align-top">
                                        <AnomaliesCell anomalies={trajet.anomalies} isEditing={isEditing}
                                                       onRemove={(i) => {
                                                           const updated = [...(trajet.anomalies ?? [])];
                                                           updated.splice(i, 1);
                                                           handleChange(trajet.id, "anomalies", updated);
                                                       }}/>
                                    </td>

                                    {/* Date */}
                                    <td className="px-2 py-1">{trajet.createdAt ? new Date(trajet.createdAt).toLocaleDateString() : "-"}</td>

                                    {/* Actions */}
                                    <td className="px-2 py-1 flex flex-wrap gap-2">
                                        {isEditing ? (
                                            <button onClick={() => handleSave(trajet.id)}
                                                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition h-8">
                                                <Save size={16}/> Enregistrer
                                            </button>
                                        ) : (
                                            <button onClick={() => setEditingTrajets(prev => [...prev, trajet.id])}
                                                    className="flex items-center justify-center bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition h-8">
                                                <Edit2 size={16}/>
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(trajet.id)}
                                                className="flex items-center justify-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition h-8">
                                            <Trash size={16}/>
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Formulaire Trajet Modal */}
            {activeTrajetId !== null && vehicule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-6 relative">
                        <button onClick={() => setActiveTrajetId(null)}
                                className="absolute top-4 right-4 text-red-600 font-bold text-xl">X
                        </button>
                        <FormulaireTrajet
                            vehicule={vehicule}
                            conducteur={conducteurs.find(c => c.id === vehiculeTrajets.find(t => t.id === activeTrajetId)?.conducteurId)}
                            trajetId={activeTrajetId}
                            onTrajetUpdated={(carburant: number) => setDernierCarburant(carburant)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}