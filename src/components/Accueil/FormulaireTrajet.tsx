'use client';
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, PlayCircle, FlagIcon, RotateCcw } from "lucide-react";
import { Vehicule } from "@/types/vehicule";

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
    maxAttempts?: number;
    onSubmit: (data: any) => void;
}

const FormulaireTrajet = ({ vehicule, conducteur, maxAttempts = 5, onSubmit }: FormulaireTrajetProps) => {
    const [codeInput, setCodeInput] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [validated, setValidated] = useState(false);
    const [phase, setPhase] = useState<"depart" | "arrivee" | null>(null);
    const [departEnregistre, setDepartEnregistre] = useState(false);
    const [arriveeEnregistre, setArriveeEnregistre] = useState(false);
    const [completed, setCompleted] = useState(false);

    const [km, setKm] = useState<number>(vehicule.km);
    const [heure, setHeure] = useState<string>("");
    const [destination, setDestination] = useState<string>("");
    const [carburant, setCarburant] = useState<number>(100);
    const [anomalie, setAnomalie] = useState<string>("");

    const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const formRef = useRef<HTMLDivElement>(null);

    const showSnackbar = (message: string, type: "success" | "error") => {
        setSnackbar({ message, type });
        setTimeout(() => setSnackbar(null), 3000);
    };

    const handleCodeValidation = () => {
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
        setPhase("depart");
        showSnackbar("Code valide ✅", "success");
    };

    const handleSubmit = () => {
        if (!phase) return showSnackbar("Sélectionnez Départ ou Arrivée", "error");

        onSubmit({
            vehiculeId: vehicule.id,
            conducteurId: conducteur!.id,
            type: phase,
            km,
            heure,
            destination,
            carburant,
            anomalie,
        });

        if (phase === "depart") {
            setDepartEnregistre(true);
            showSnackbar("Départ enregistré ✅", "success");
        }
        if (phase === "arrivee") {
            setArriveeEnregistre(true);
            showSnackbar("Arrivée enregistrée ✅", "success");
        }

        setPhase(null);
        setKm(vehicule.km);
        setHeure("");
        setDestination("");
        setCarburant(100);
        setAnomalie("");
    };

    const resetForm = () => {
        setKm(vehicule.km);
        setHeure("");
        setDestination("");
        setCarburant(100);
        setAnomalie("");
    };

    const handleNewTrajet = () => {
        setValidated(false);
        setCodeInput("");
        setAttempts(0);
        setDisabled(false);
        setDepartEnregistre(false);
        setArriveeEnregistre(false);
        setCompleted(false);
        resetForm();
    };

    useEffect(() => {
        if (departEnregistre && arriveeEnregistre) setCompleted(true);
    }, [departEnregistre, arriveeEnregistre]);

    // Scroll auto sur le formulaire actif
    useEffect(() => {
        if (phase === "arrivee" && !destination) setDestination("ITEP 66");
        if (phase && formRef.current) formRef.current.scrollIntoView({ behavior: "smooth" });
    }, [phase]);

    // Progression
    const progress =
        completed ? 100 : arriveeEnregistre ? 75 : departEnregistre ? 50 : validated ? 25 : 0;

    const stepText = completed
        ? "Étape 4 sur 4 — Terminé 🎉"
        : arriveeEnregistre
            ? "Étape 3 sur 4 — Arrivée"
            : departEnregistre
                ? "Étape 2 sur 4 — Départ"
                : validated
                    ? "Étape 2 sur 4 — Départ"
                    : "Étape 1 sur 4 — Validation du conducteur";

    // Animation config
    const variants = {
        initial: { x: 300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -300, opacity: 0 },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Snackbar mobile */}
            <AnimatePresence>
                {snackbar && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className={`fixed bottom-6 px-6 py-3 rounded-full shadow-lg text-white text-center z-50 ${
                            snackbar.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                        role="alert"
                        aria-live="assertive"
                    >
                        {snackbar.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Barre de progression */}
            <div className="w-full max-w-sm mb-2">
                <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-blue-600 rounded-full"
                    />
                </div>
                <p className="mt-2 text-center text-sm font-medium text-gray-700">{stepText}</p>
            </div>

            {/* Contenu principal */}
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 space-y-4" ref={formRef}>
                <h2 className="text-2xl font-bold text-center">{vehicule.type} - {vehicule.modele}</h2>
                <p className="text-center text-gray-600">Immatriculation: {vehicule.immat}</p>
                <p className="text-center text-gray-600">
                    Conducteur: {conducteur ? `${conducteur.prenom} ${conducteur.nom}` : "Non attribué"}
                </p>

                {completed ? (
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold text-green-600">Merci 🎉</h3>
                        <p>Le trajet est terminé. Un nouveau conducteur peut s'identifier.</p>
                        <button
                            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-400"
                            onClick={handleNewTrajet}
                            aria-label="Démarrer un nouveau trajet"
                        >
                            <RotateCcw size={20} />
                            Nouveau trajet
                        </button>
                    </div>
                ) : !validated ? (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Code conducteur"
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            disabled={disabled || !conducteur}
                            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                            aria-label="Entrer le code conducteur"
                        />
                        <button
                            onClick={handleCodeValidation}
                            disabled={disabled || !conducteur}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-400"
                            aria-label="Valider le code conducteur"
                        >
                            <KeyRound size={20} />
                            Commencer
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPhase("depart")}
                                disabled={departEnregistre}
                                className={`flex-1 py-3 rounded-xl shadow focus:ring-2 focus:ring-green-400 ${
                                    departEnregistre ? "bg-gray-300" : "bg-green-600 text-white"
                                }`}
                                aria-label="Sélectionner départ"
                            >
                                Départ
                            </button>
                            <button
                                onClick={() => setPhase("arrivee")}
                                disabled={!departEnregistre || arriveeEnregistre}
                                className={`flex-1 py-3 rounded-xl shadow focus:ring-2 focus:ring-blue-400 ${
                                    (!departEnregistre || arriveeEnregistre) ? "bg-gray-300" : "bg-blue-600 text-white"
                                }`}
                                aria-label="Sélectionner arrivée"
                            >
                                Arrivée
                            </button>
                        </div>

                        {phase && (
                            <div className="space-y-3 mt-4">
                                <input type="number" placeholder={`Kilométrage ${phase}`} value={km} onChange={e => setKm(Number(e.target.value))} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" aria-label={`Kilométrage ${phase}`} />
                                <input type="time" value={heure} onChange={e => setHeure(e.target.value)} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" aria-label={`Heure ${phase}`} />
                                <input type="text" placeholder={`Destination ${phase}`} value={destination} onChange={e => setDestination(e.target.value)} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" aria-label={`Destination ${phase}`} />
                                <input type="number" placeholder={`Carburant ${phase} (%)`} value={carburant} onChange={e => setCarburant(Number(e.target.value))} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" aria-label={`Carburant ${phase}`} />
                                <textarea placeholder={`Anomalie ${phase}`} value={anomalie} onChange={e => setAnomalie(e.target.value)} className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500" aria-label={`Anomalie ${phase}`} />
                                <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-xl shadow flex items-center justify-center gap-2 focus:ring-2 focus:ring-green-400" aria-label={`Valider ${phase}`}>
                                    {phase === "depart" ? <><PlayCircle size={20}/> Valider le départ</> : <><FlagIcon size={20}/> Valider l’arrivée</>}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FormulaireTrajet;