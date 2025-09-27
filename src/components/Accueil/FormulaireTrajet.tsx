"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, PlayCircle, FlagIcon, RotateCcw } from "lucide-react";
import { Vehicule } from "@/types/vehicule";
import { Trajet, useTrajets } from "@/context/trajetsContext";

interface Conducteur {
    id: number;
    nom: string;
    prenom: string;
    code: string;
    vehiculeId?: number;
}

interface FormulaireTrajetProps {
    vehicule: Vehicule;
    conducteur?: Conducteur;
    trajetId: number;
    maxAttempts?: number;
}

/** 📷 Scanner QR */
const QRScanner = ({ onScan, disabled }: { onScan: (text: string) => void; disabled: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (disabled) return;
        let stream: MediaStream;
        let interval: number;

        const startCamera = async () => {
            if (!("BarcodeDetector" in window)) {
                alert("Votre navigateur ne supporte pas BarcodeDetector.");
                return;
            }
            const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                if (videoRef.current) videoRef.current.srcObject = stream;
                videoRef.current?.play();

                interval = window.setInterval(async () => {
                    if (!videoRef.current) return;
                    const barcodes = await detector.detect(videoRef.current);
                    if (barcodes.length > 0) {
                        onScan(barcodes[0].rawValue);
                        clearInterval(interval);
                        stream.getTracks().forEach((track) => track.stop());
                    }
                }, 500);
            } catch (err) {
                console.error(err);
            }
        };

        startCamera();
        return () => {
            clearInterval(interval);
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [onScan, disabled]);

    return <video ref={videoRef} className="w-full max-w-sm rounded-xl shadow mb-4" />;
};

/** 🚌 Formulaire principal */
const FormulaireTrajet = ({ vehicule, conducteur, trajetId, maxAttempts = 5 }: FormulaireTrajetProps) => {
    const { trajets, updateTrajet } = useTrajets();
    const trajet = trajets.find((t) => t.id === trajetId);

    // 🔑 Sécurité conducteur
    const [codeInput, setCodeInput] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [validated, setValidated] = useState(false);
    const [disabled, setDisabled] = useState(false);

    // 🚦 État du trajet
    const [phase, setPhase] = useState<"depart" | "arrivee" | null>(null);
    const [completed, setCompleted] = useState(false);
    const [scanPhase, setScanPhase] = useState<"depart" | "arrivee" | null>(null);

    // 📊 Données formulaire
    const [kmDepart, setKmDepart] = useState<number>(vehicule.km);
    const [kmArrivee, setKmArrivee] = useState<number>(vehicule.km);
    const [heureDepart, setHeureDepart] = useState<string>("");
    const [heureArrivee, setHeureArrivee] = useState<string>("");
    const [destinationDepart, setDestinationDepart] = useState<string>("");
    const [destinationArrivee, setDestinationArrivee] = useState<string>("");
    const [carburantDepart, setCarburantDepart] = useState<number>(100);
    const [carburantArrivee, setCarburantArrivee] = useState<number>(100);
    const [anomaliesDepart, setAnomaliesDepart] = useState<string[]>([]);
    const [anomaliesArrivee, setAnomaliesArrivee] = useState<string[]>([]);
    const [newAnomalie, setNewAnomalie] = useState<string>("");

    // UI
    const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    const nowTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    };

    const showSnackbar = (message: string, type: "success" | "error") => {
        setSnackbar({ message, type });
        setTimeout(() => setSnackbar(null), 3000);
    };

    // 🔄 Initialisation
    useEffect(() => {
        if (!trajet) return;
        if (trajet.kmDepart) {
            setKmDepart(trajet.kmDepart);
            setHeureDepart(trajet.heureDepart || "");
            setDestinationDepart(trajet.destination || "");
            setCarburantDepart(trajet.carburant ?? 100);
            setAnomaliesDepart(trajet.anomalies || []);
            setPhase("arrivee");
        }
        if (trajet.kmArrivee) {
            setKmArrivee(trajet.kmArrivee);
            setHeureArrivee(trajet.heureArrivee || "");
            setCompleted(true);
            setDisabled(true);
        }
    }, [trajet]);

    /** 🔑 Validation code conducteur */
    const validateCode = () => {
        if (!conducteur) return showSnackbar("Aucun conducteur attribué !", "error");
        if (codeInput !== conducteur.code) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            if (newAttempts >= maxAttempts) {
                setDisabled(true);
                showSnackbar("Nombre maximum d'essais atteint.", "error");
            } else {
                showSnackbar(`Code incorrect (${newAttempts}/${maxAttempts})`, "error");
            }
            return;
        }
        setValidated(true);
        showSnackbar("Code valide ✅", "success");
    };

    /** 📷 Scan QR */
    const handleScan = (text: string) => {
        showSnackbar(`QR scanné: ${text}`, "success");
        if (!trajet?.kmDepart) {
            // Premier scan → départ
            setScanPhase("depart");
            setKmDepart(vehicule.km);
            setHeureDepart(nowTime());
        } else {
            // Deuxième scan → arrivée
            setScanPhase("arrivee");
            setHeureArrivee(nowTime());
        }
    };

    /** 💾 Soumission formulaire */
    const handleSubmit = async () => {
        if (!scanPhase || !trajet) return showSnackbar("Erreur : trajet introuvable", "error");
        const payload: Partial<Trajet> = {
            ...trajet,
            kmDepart: scanPhase === "depart" ? kmDepart : trajet.kmDepart,
            heureDepart: scanPhase === "depart" ? heureDepart : trajet.heureDepart,
            kmArrivee: scanPhase === "arrivee" ? kmArrivee : trajet.kmArrivee,
            heureArrivee: scanPhase === "arrivee" ? heureArrivee : trajet.heureArrivee,
            destination: scanPhase === "depart" ? destinationDepart : destinationArrivee,
            carburant: scanPhase === "depart" ? carburantDepart : carburantArrivee,
            anomalies: Array.from(new Set([
                ...(scanPhase === "depart" ? anomaliesDepart : anomaliesArrivee),
                ...(newAnomalie.trim() ? [newAnomalie.trim()] : [])
            ]))
        };

        if (scanPhase === "arrivee" && kmArrivee < (trajet.kmDepart ?? 0)) {
            return showSnackbar("Km arrivée doit être supérieur au km départ", "error");
        }

        try {
            await updateTrajet(payload);
            showSnackbar(`${scanPhase === "depart" ? "Départ" : "Arrivée"} enregistré ✅`, "success");
            setNewAnomalie("");

            if (scanPhase === "arrivee") {
                vehicule.km = kmArrivee;
                setCompleted(true);
                setDisabled(true);
            }
            setScanPhase(null);
            setValidated(false);
            setCodeInput("");
        } catch (err) {
            console.error(err);
            showSnackbar("Impossible de sauvegarder", "error");
        }
    };

    /** 🆕 Nouveau trajet */
    const handleNewTrajet = () => {
        setValidated(false);
        setCodeInput("");
        setAttempts(0);
        setDisabled(false);
        setPhase(null);
        setCompleted(false);
        setScanPhase(null);

        setKmDepart(vehicule.km);
        setKmArrivee(vehicule.km);
        setHeureDepart("");
        setHeureArrivee("");
        setDestinationDepart("");
        setDestinationArrivee("");
        setCarburantDepart(100);
        setCarburantArrivee(100);
        setAnomaliesDepart([]);
        setAnomaliesArrivee([]);
        setNewAnomalie("");
    };

    useEffect(() => {
        if (scanPhase && formRef.current) formRef.current.scrollIntoView({ behavior: "smooth" });
    }, [scanPhase]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Snackbar */}
            <AnimatePresence>
                {snackbar && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className={`fixed bottom-6 px-6 py-3 rounded-full shadow-lg text-white text-center z-50 ${
                            snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                        {snackbar.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Carte véhicule */}
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 space-y-4" ref={formRef}>
                <h2 className="text-2xl font-bold text-center">{vehicule.type} - {vehicule.modele}</h2>
                <p className="text-center text-gray-600">Immatriculation: {vehicule.immat}</p>
                <p className="text-center text-gray-600">
                    Conducteur: {conducteur ? `${conducteur.prenom} ${conducteur.nom}` : "Non attribué"}
                </p>

                {/* Étapes */}
                {!validated ? (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Code conducteur"
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            disabled={disabled || !conducteur}
                            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={validateCode}
                            disabled={disabled || !conducteur}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2"
                        >
                            <KeyRound size={20} /> Valider
                        </button>
                    </div>
                ) : completed ? (
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold text-green-600">Trajet terminé 🎉</h3>
                        <button
                            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2"
                            onClick={handleNewTrajet}
                        >
                            <RotateCcw size={20} /> Nouveau trajet
                        </button>
                    </div>
                ) : !scanPhase ? (
                    <QRScanner onScan={handleScan} disabled={disabled} />
                ) : (
                    <div className="space-y-3">
                        {/* Formulaire départ */}
                        {scanPhase === "depart" && (
                            <>
                                <input type="number" value={kmDepart} readOnly className="w-full border px-4 py-3 rounded-xl bg-gray-100" />
                                <input type="time" value={heureDepart} readOnly className="w-full border px-4 py-3 rounded-xl bg-gray-100" />
                                <input
                                    type="text"
                                    placeholder="Lieu de départ"
                                    value={destinationDepart}
                                    onChange={(e) => setDestinationDepart(e.target.value)}
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Carburant (%)"
                                    value={carburantDepart}
                                    onChange={(e) => setCarburantDepart(Number(e.target.value))}
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="space-y-1">
                                    <label className="font-medium">Anomalies</label>
                                    {anomaliesDepart.map((a, i) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
                                            <span>{a}</span>
                                            <button type="button" onClick={() => setAnomaliesDepart(prev => prev.filter((_, idx) => idx !== i))} className="text-red-600 font-bold">X</button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Ajouter anomalie"
                                            value={newAnomalie}
                                            onChange={(e) => setNewAnomalie(e.target.value)}
                                            className="flex-1 border px-2 py-1 rounded"
                                        />
                                        <button type="button" onClick={() => { if (!newAnomalie.trim()) return; setAnomaliesDepart(prev => [...prev, newAnomalie.trim()]); setNewAnomalie(""); }} className="bg-green-600 text-white px-3 rounded">+</button>
                                    </div>
                                </div>
                                <button type="button" onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2">
                                    <PlayCircle size={20} /> Valider le départ
                                </button>
                            </>
                        )}

                        {/* Formulaire arrivée */}
                        {scanPhase === "arrivee" && (
                            <>
                                <input type="number" value={trajet?.kmDepart} readOnly className="w-full border px-4 py-3 rounded-xl bg-gray-100" />
                                <input
                                    type="number"
                                    placeholder="Kilométrage arrivée"
                                    value={kmArrivee}
                                    onChange={(e) => setKmArrivee(Number(e.target.value))}
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                                <input type="time" value={heureArrivee} readOnly className="w-full border px-4 py-3 rounded-xl bg-gray-100" />
                                <input
                                    type="text"
                                    placeholder="Lieu d’arrivée"
                                    value={destinationArrivee}
                                    onChange={(e) => setDestinationArrivee(e.target.value)}
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Carburant (%)"
                                    value={carburantArrivee}
                                    onChange={(e) => setCarburantArrivee(Number(e.target.value))}
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="space-y-1">
                                    <label className="font-medium">Anomalies</label>
                                    {anomaliesArrivee.map((a, i) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
                                            <span>{a}</span>
                                            <button type="button" onClick={() => setAnomaliesArrivee(prev => prev.filter((_, idx) => idx !== i))} className="text-red-600 font-bold">X</button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Ajouter anomalie"
                                            value={newAnomalie}
                                            onChange={(e) => setNewAnomalie(e.target.value)}
                                            className="flex-1 border px-2 py-1 rounded"
                                        />
                                        <button type="button" onClick={() => { if (!newAnomalie.trim()) return; setAnomaliesArrivee(prev => [...prev, newAnomalie.trim()]); setNewAnomalie(""); }} className="bg-green-600 text-white px-3 rounded">+</button>
                                    </div>
                                </div>
                                <button type="button" onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2">
                                    <FlagIcon size={20} /> Valider l’arrivée
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormulaireTrajet;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// "use client";
//
// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { KeyRound, PlayCircle, FlagIcon, RotateCcw } from "lucide-react";
// import { Vehicule } from "@/types/vehicule";
// import { Trajet, useTrajets } from "@/context/trajetsContext";
//
// interface Conducteur {
//     id: number;
//     nom: string;
//     prenom: string;
//     code: string;
//     vehiculeId?: number;
// }
//
// interface FormulaireTrajetProps {
//     vehicule: Vehicule;
//     conducteur?: Conducteur;
//     trajetId: number;
//     maxAttempts?: number;
// }
//
// const FormulaireTrajet = ({ vehicule, conducteur, trajetId, maxAttempts = 5 }: FormulaireTrajetProps) => {
//     const { trajets, updateTrajet } = useTrajets();
//
//     const [codeInput, setCodeInput] = useState("");
//     const [attempts, setAttempts] = useState(0);
//     const [disabled, setDisabled] = useState(false);
//     const [validated, setValidated] = useState(false);
//     const [phase, setPhase] = useState<"depart" | "arrivee" | null>(null);
//     const [completed, setCompleted] = useState(false);
//
//     const [km, setKm] = useState<number>(vehicule.km);
//     const [heure, setHeure] = useState<string>("");
//     const [destination, setDestination] = useState<string>("");
//     const [carburant, setCarburant] = useState<number>(100);
//     const [anomalies, setAnomalies] = useState<string[]>([]);
//     const [newAnomalie, setNewAnomalie] = useState<string>("");
//
//     const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
//     const formRef = useRef<HTMLDivElement>(null);
//
//     const trajet = trajets.find(t => t.id === trajetId);
//
//     // Charger les données existantes du trajet
//     useEffect(() => {
//         if (!trajet) return;
//         setKm(trajet.kmDepart ?? vehicule.km);
//         setDestination(trajet.destination || "");
//         setCarburant(trajet.carburant ?? 100);
//         setAnomalies(trajet.anomalies || []);
//     }, [trajet]);
//
//     const showSnackbar = (message: string, type: "success" | "error") => {
//         setSnackbar({ message, type });
//         setTimeout(() => setSnackbar(null), 3000);
//     };
//
//     const handleCodeValidation = () => {
//         if (!conducteur) return showSnackbar("Aucun conducteur attribué !", "error");
//         if (codeInput !== conducteur.code) {
//             const newAttempts = attempts + 1;
//             setAttempts(newAttempts);
//             if (newAttempts >= maxAttempts) {
//                 setDisabled(true);
//                 showSnackbar("Nombre maximum d'essais atteint.", "error");
//             } else showSnackbar(`Code incorrect (${newAttempts}/${maxAttempts})`, "error");
//             return;
//         }
//         setValidated(true);
//         setPhase("depart");
//         showSnackbar("Code valide ✅", "success");
//     };
//
//     const handleSubmit = async () => {
//         if (!phase) return showSnackbar("Sélectionnez Départ ou Arrivée", "error");
//
//         if (!trajet) return showSnackbar("Trajet introuvable", "error");
//
//         // Validation du km
//         if (phase === "arrivee" && km < vehicule.km) {
//             return showSnackbar("Le kilométrage d'arrivée ne peut pas être inférieur au kilométrage actuel du véhicule.", "error");
//         }
//
//         const allAnomalies = newAnomalie.trim() ? [...anomalies, newAnomalie.trim()] : anomalies;
//
//         const payload: Partial<Trajet> = {
//             ...trajet,
//             carburant,
//             destination: destination || trajet.destination,
//             anomalies: Array.from(new Set(allAnomalies)),
//             kmDepart: phase === "depart" ? km : trajet.kmDepart,
//             heureDepart: phase === "depart" ? heure || trajet.heureDepart : trajet.heureDepart,
//             kmArrivee: phase === "arrivee" ? km : trajet.kmArrivee,
//             heureArrivee: phase === "arrivee" ? heure || trajet.heureArrivee : trajet.heureArrivee,
//         };
//
//         try {
//             await updateTrajet(payload);
//
//             if (phase === "arrivee") vehicule.km = km;
//
//             if (phase === "arrivee") setCompleted(true);
//             else if (phase === "depart") setPhase("arrivee");
//
//             showSnackbar(`${phase === "depart" ? "Départ" : "Arrivée"} mis à jour ✅`, "success");
//
//             setHeure("");
//             setDestination("");
//             setCarburant(100);
//             setAnomalies([]);
//             setNewAnomalie("");
//         } catch (err) {
//             console.error(err);
//             showSnackbar("Impossible de mettre à jour le trajet", "error");
//         }
//     };
//
//     const handleAddAnomalie = () => {
//         if (!newAnomalie.trim()) return;
//         setAnomalies(prev => Array.from(new Set([...prev, newAnomalie.trim()])));
//         setNewAnomalie("");
//     };
//
//     const handleRemoveAnomalie = (index: number) => {
//         setAnomalies(prev => prev.filter((_, i) => i !== index));
//     };
//
//     const handleNewTrajet = () => {
//         setValidated(false);
//         setCodeInput("");
//         setAttempts(0);
//         setDisabled(false);
//         setPhase(null);
//         setCompleted(false);
//         setKm(vehicule.km);
//         setHeure("");
//         setDestination("");
//         setCarburant(100);
//         setAnomalies([]);
//         setNewAnomalie("");
//     };
//
//     useEffect(() => {
//         if (phase && formRef.current) formRef.current.scrollIntoView({ behavior: "smooth" });
//     }, [phase]);
//
//     const progress = completed ? 100 : phase === "arrivee" ? 75 : validated ? 25 : 0;
//     const stepText = completed ? "Étape 4 sur 4 — Terminé 🎉"
//         : phase === "arrivee" ? "Étape 3 sur 4 — Arrivée"
//             : phase === "depart" ? "Étape 2 sur 4 — Départ"
//                 : "Étape 1 sur 4 — Validation du conducteur";
//
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//             <AnimatePresence>
//                 {snackbar && (
//                     <motion.div
//                         initial={{ y: 50, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         exit={{ y: 50, opacity: 0 }}
//                         className={`fixed bottom-6 px-6 py-3 rounded-full shadow-lg text-white text-center z-50 ${
//                             snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
//                         }`}
//                     >
//                         {snackbar.message}
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//
//             <div className="w-full max-w-sm mb-2">
//                 <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
//                     <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: `${progress}%` }}
//                         transition={{ duration: 0.6 }}
//                         className="h-full bg-blue-600 rounded-full"
//                     />
//                 </div>
//                 <p className="mt-2 text-center text-sm font-medium text-gray-700">{stepText}</p>
//             </div>
//
//             <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 space-y-4" ref={formRef}>
//                 <h2 className="text-2xl font-bold text-center">{vehicule.type} - {vehicule.modele}</h2>
//                 <p className="text-center text-gray-600">Immatriculation: {vehicule.immat}</p>
//                 <p className="text-center text-gray-600">
//                     Conducteur: {conducteur ? `${conducteur.prenom} ${conducteur.nom}` : "Non attribué"}
//                 </p>
//
//                 {completed ? (
//                     <div className="text-center space-y-4">
//                         <h3 className="text-xl font-semibold text-green-600">Trajet terminé 🎉</h3>
//                         <button className="w-full bg-blue-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2" onClick={handleNewTrajet}>
//                             <RotateCcw size={20} /> Nouveau trajet
//                         </button>
//                     </div>
//                 ) : !validated ? (
//                     <div className="space-y-3">
//                         <input type="text" placeholder="Code conducteur" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} disabled={disabled || !conducteur} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" />
//                         <button type="button" onClick={handleCodeValidation} disabled={disabled || !conducteur} className="w-full bg-blue-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2">
//                             <KeyRound size={20} /> Commencer
//                         </button>
//                     </div>
//                 ) : conducteur ? (
//                     <div className="space-y-3">
//                         <div className="flex gap-3">
//                             <button type="button" onClick={() => setPhase("depart")} disabled={phase !== null && phase !== "depart"} className={`flex-1 py-3 rounded-xl shadow ${phase !== "depart" ? "bg-gray-300" : "bg-green-600 text-white"}`}>Départ</button>
//                             <button type="button" onClick={() => setPhase("arrivee")} disabled={phase !== "arrivee" && phase !== null} className={`flex-1 py-3 rounded-xl shadow ${phase !== "arrivee" ? "bg-gray-300" : "bg-blue-600 text-white"}`}>Arrivée</button>
//                         </div>
//
//                         {phase && (
//                             <div className="space-y-3 mt-4">
//                                 <input type="number" placeholder={`Kilométrage ${phase}`} value={km} onChange={e => setKm(Number(e.target.value))} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" />
//                                 <input type="time" value={heure} onChange={e => setHeure(e.target.value)} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" />
//                                 <input type="text" placeholder={`Destination ${phase}`} value={destination} onChange={e => setDestination(e.target.value)} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" />
//                                 <input type="number" placeholder={`Carburant ${phase} (%)`} value={carburant} onChange={e => setCarburant(Number(e.target.value))} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" />
//
//                                 <div className="space-y-1">
//                                     <label className="font-medium">Anomalies</label>
//                                     {anomalies.map((a, i) => (
//                                         <div key={i} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded">
//                                             <span>{a}</span>
//                                             <button type="button" onClick={() => handleRemoveAnomalie(i)} className="text-red-600 font-bold">X</button>
//                                         </div>
//                                     ))}
//                                     <div className="flex gap-2">
//                                         <input type="text" placeholder="Ajouter anomalie" value={newAnomalie} onChange={e => setNewAnomalie(e.target.value)} className="flex-1 border px-2 py-1 rounded" />
//                                         <button type="button" onClick={handleAddAnomalie} className="bg-green-600 text-white px-3 rounded">+</button>
//                                     </div>
//                                 </div>
//
//                                 <button type="button" onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2">
//                                     {phase === "depart" ? <><PlayCircle size={20} /> Valider le départ</> : <><FlagIcon size={20} /> Valider l’arrivée</>}
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <p className="text-center text-red-500 font-medium">Aucun conducteur attribué 🚫</p>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default FormulaireTrajet;