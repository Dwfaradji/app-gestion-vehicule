"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, RotateCcw } from "lucide-react";
import type { Vehicule } from "@/types/vehicule";
import { useTrajets } from "@/context/trajetsContext";
import QRScanner from "@/hooks/QRScanner";
import ArriveeSection from "@/components/trajets/ArriveeSection";
import DepartSection from "@/components/trajets/DepartSection";
import type { Conducteur, Trajet } from "@/types/trajet";

interface FormulaireTrajetProps {
  vehicule: Vehicule;
  conducteur?: Conducteur;
  trajetId: number;
  maxAttempts?: number;
  onTrajetUpdated?: (carburant: number) => void; // 🔹
}

const FormulaireTrajet = ({
  vehicule,
  conducteur,
  trajetId,
  maxAttempts = 5,
  onTrajetUpdated,
}: FormulaireTrajetProps) => {
  const { trajets, updateTrajet } = useTrajets();
  const trajet = trajets.find((t) => t.id === trajetId);

  // 🔑 Sécurité conducteur
  const [codeInput, setCodeInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [validated, setValidated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // 🚦 État du trajet
  const [completed, setCompleted] = useState(false);
  const [scanPhase, setScanPhase] = useState<"depart" | "arrivee" | null>(null);

  // 📊 Données formulaire
  const [kmDepart, setKmDepart] = useState<number>(vehicule.km);
  const [kmArrivee, setKmArrivee] = useState<number>(vehicule.km);
  const [heureDepart, setHeureDepart] = useState<string>("");
  const [heureArrivee, setHeureArrivee] = useState<string>("");
  const [destinationDepart, setDestinationDepart] = useState<string>("");
  const [destinationArrivee, setDestinationArrivee] = useState<string>("ITEP");
  const [carburantDepart, setCarburantDepart] = useState<number>(100);
  const [carburantArrivee, setCarburantArrivee] = useState<number>(100);
  const [anomaliesDepart, setAnomaliesDepart] = useState<string[]>([]);
  const [anomaliesArrivee, setAnomaliesArrivee] = useState<string[]>([]);
  const [newAnomalie, setNewAnomalie] = useState<string>("");
  const [pleinDepart, setPleinDepart] = useState(false);
  const [pleinArrivee, setPleinArrivee] = useState(false);

  // UI
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const nowTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  const showSnackbar = (message: string, type: "success" | "error" | "warning" = "success") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  // 🔄 Initialisation
  useEffect(() => {
    if (!trajets || !vehicule) return;

    const vehiculeTrajets = trajets
      .filter((t) => t.vehiculeId === vehicule.id)
      .sort((a, b) => {
        const dateA = a.heureDepart ? new Date(`1970-01-01T${a.heureDepart}:00`) : new Date(0);
        const dateB = b.heureDepart ? new Date(`1970-01-01T${b.heureDepart}:00`) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

    const lastTrajet = vehiculeTrajets[0];

    if (lastTrajet) {
      setKmDepart(lastTrajet.kmArrivee ?? vehicule.km);
      setCarburantDepart(lastTrajet.carburant ?? 100);
      setAnomaliesDepart(lastTrajet.anomalies ?? []);
    } else {
      setKmDepart(vehicule.km);
      setCarburantDepart(100);
      setAnomaliesDepart([]);
    }

    if (trajet?.kmArrivee) {
      setKmArrivee(trajet.kmArrivee);
      setHeureArrivee(trajet.heureArrivee || "");
      setCompleted(true);
      setDisabled(true);
    } else {
      setKmArrivee(lastTrajet?.kmArrivee ?? vehicule.km);
      setHeureArrivee("");
      setCompleted(false);
      setDisabled(false);
    }
  }, [trajets, trajet, vehicule]);

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
    const match = text.match(/\/formulaire-trajet\/(\d+)/);
    if (!match) return showSnackbar("QR code invalide ❌", "error");

    const scannedVehiculeId = Number(match[1]);
    if (scannedVehiculeId !== vehicule.id)
      return showSnackbar("Ce QR code ne correspond pas à ce véhicule ❌", "error");

    showSnackbar(`QR scanné pour le véhicule ${vehicule.immat} ✅`, "success");

    if (!trajet?.kmDepart || !trajet?.heureDepart) {
      setScanPhase("depart");
      setKmDepart(vehicule.km);
      setHeureDepart(nowTime());
    } else {
      setScanPhase("arrivee");
      setHeureArrivee(nowTime());
      setDestinationArrivee("ITEP");
      setAnomaliesArrivee([...anomaliesDepart]);
    }
  };

  /** 💾 Soumission formulaire */
  const handleSubmit = async () => {
    if (!scanPhase || !trajet) return showSnackbar("Erreur : trajet introuvable", "error");

    if (scanPhase === "arrivee" && kmArrivee < (trajet.kmDepart ?? 0))
      return showSnackbar("Km arrivée doit être supérieur au km départ", "error");

    const anomaliesFinales = Array.from(
      new Set([
        ...(scanPhase === "depart" ? anomaliesDepart : anomaliesArrivee),
        ...(newAnomalie.trim() ? [newAnomalie.trim()] : []),
        ...(scanPhase === "depart" && pleinDepart ? ["Plein de carburant effectué au départ"] : []),
        ...(scanPhase === "arrivee" && pleinArrivee
          ? ["Plein de carburant effectué à l'arrivée"]
          : []),
      ]),
    );

    if (!trajet?.id) return showSnackbar("Trajet introuvable", "error");

    const payload: Partial<Trajet> & { id: number } = {
      ...trajet,
      id: trajet.id,
      kmDepart: scanPhase === "depart" ? kmDepart : trajet.kmDepart,
      heureDepart: scanPhase === "depart" ? heureDepart : trajet.heureDepart,
      kmArrivee: scanPhase === "arrivee" ? kmArrivee : trajet.kmArrivee,
      heureArrivee: scanPhase === "arrivee" ? heureArrivee : trajet.heureArrivee,
      destination: scanPhase === "depart" ? destinationDepart : destinationArrivee,
      carburant: scanPhase === "depart" ? carburantDepart : carburantArrivee,
      anomalies: anomaliesFinales,
    };

    try {
      await updateTrajet(payload);
      showSnackbar(`${scanPhase === "depart" ? "Départ" : "Arrivée"} enregistré ✅`, "success");
      // 🔹 Mise à jour du carburant dans DetailTrajetPage
      if (scanPhase === "arrivee" && onTrajetUpdated) {
        onTrajetUpdated(carburantArrivee);
      }

      setNewAnomalie("");
      setPleinDepart(false);
      setPleinArrivee(false);

      if (scanPhase === "arrivee") {
        // eslint-disable-next-line react-hooks/immutability
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
    setCompleted(false);
    setScanPhase(null);

    setKmDepart(vehicule.km);
    setKmArrivee(vehicule.km);
    setHeureDepart("");
    setHeureArrivee("");
    setDestinationDepart("");
    setDestinationArrivee("ITEP");
    setCarburantDepart(100);
    setCarburantArrivee(100);
    setAnomaliesDepart([]);
    setAnomaliesArrivee([]);
    setNewAnomalie("");
    setPleinDepart(false);
    setPleinArrivee(false);
  };

  useEffect(() => {
    if (scanPhase && formRef.current) formRef.current.scrollIntoView({ behavior: "smooth" });
  }, [scanPhase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <AnimatePresence>
        {snackbar && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`fixed bottom-6 px-6 py-3 rounded-full shadow-lg text-white text-center z-50 ${
              snackbar.type === "success"
                ? "bg-green-600"
                : snackbar.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-red-600"
            }`}
          >
            {snackbar.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 space-y-4" ref={formRef}>
        <h2 className="text-2xl font-bold text-center">
          {vehicule.type} - {vehicule.modele}
        </h2>
        <p className="text-center text-gray-600">Immatriculation: {vehicule.immat}</p>
        <p className="text-center text-gray-600">
          Conducteur: {conducteur ? `${conducteur.prenom} ${conducteur.nom}` : "Non attribué"}
        </p>

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
            {scanPhase === "depart" && (
              <DepartSection
                kmDepart={kmDepart}
                heureDepart={heureDepart}
                destinationDepart={destinationDepart}
                carburantDepart={carburantDepart}
                anomaliesDepart={anomaliesDepart}
                newAnomalie={newAnomalie}
                pleinDepart={pleinDepart}
                setKmDepart={setKmDepart}
                setDestinationDepart={setDestinationDepart}
                setCarburantDepart={setCarburantDepart}
                setAnomaliesDepart={setAnomaliesDepart}
                setNewAnomalie={setNewAnomalie}
                setPleinDepart={setPleinDepart}
                handleSubmit={handleSubmit}
              />
            )}
            {scanPhase === "arrivee" && (
              <ArriveeSection
                kmDepart={trajet?.kmDepart ?? 0}
                kmArrivee={kmArrivee}
                heureArrivee={heureArrivee}
                destinationArrivee={destinationArrivee}
                carburantArrivee={carburantArrivee}
                anomaliesArrivee={anomaliesArrivee}
                newAnomalie={newAnomalie}
                pleinArrivee={pleinArrivee}
                setKmArrivee={setKmArrivee}
                setDestinationArrivee={setDestinationArrivee}
                setCarburantArrivee={setCarburantArrivee}
                setAnomaliesArrivee={setAnomaliesArrivee}
                setNewAnomalie={setNewAnomalie}
                setPleinArrivee={setPleinArrivee}
                handleSubmit={handleSubmit}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaireTrajet;
