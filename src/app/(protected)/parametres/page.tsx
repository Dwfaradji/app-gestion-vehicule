"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Contexts
import { useVehicules } from "@/context/vehiculesContext";
import { useEmails } from "@/context/emailsContext";
import { useUtilisateurs } from "@/context/utilisateursContext";
import { useParametresEntretien } from "@/context/parametresEntretienContext";
import { useTrajets } from "@/context/trajetsContext";

// Components
import TabVehicules from "@/components/vehicules/TabVehicule";
import TabEmails from "@/components/emails/TabEmails";
import TabEntretien from "@/components/entretiens/TabEntretien";
import TabUtilisateurs from "@/components/utilisateurs/TabUtilisateurs";
import TabPassword from "@/components/utilisateurs/TabPassword";
import TabArchive from "@/components/utilisateurs/TabArchive";
import TabConducteurs from "@/components/utilisateurs/TabConducteurs";

// Types & helpers
import type { ConfirmAction } from "@/types/actions";
import getConfirmMessage from "@/helpers/helperConfirm";
import { useSession } from "next-auth/react";
import Loader from "@/components/layout/Loader";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import TabEntreprise from "@/components/utilisateurs/TabEntreprise";

type Onglet =
  | "Véhicules"
  | "Emails"
  | "Mot de passe admin"
  | "Paramètres entretien"
  | "Utilisateurs"
  | "Archivage"
  | "Conducteurs"
|"Infos";

const tabs: Onglet[] = [
  "Véhicules",
  "Emails",
  "Mot de passe admin",
  "Paramètres entretien",
  "Utilisateurs",
  "Archivage",
  "Conducteurs",
    "Infos"
];

export default function ParametresPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<Onglet>("Véhicules");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const { vehicules, addVehicule, deleteVehicule } = useVehicules();
  const { utilisateurs, addUtilisateur, deleteUtilisateur, updatePassword } = useUtilisateurs();
  const {
    parametresEntretien,
    addParametreEntretien,
    deleteParametreEntretien,
    updateParametreEntretien,
  } = useParametresEntretien();
  const { addConducteur, deleteConducteur } = useTrajets();
  const { addEmail, deleteEmail } = useEmails();

  const currentUserId = session?.user?.id;

  const isLoading = useGlobalLoading();

  // Lire l'onglet depuis l'URL au chargement
  useEffect(() => {
    const tabParam = searchParams.get("tab") as Onglet;
    if (tabParam && tabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Mettre à jour l'URL et scroll vers le haut
  const handleTabClick = (tab: Onglet) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);

    // Scroll vers le haut du main
    const main = document.querySelector("main");
    main?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { type, target } = confirmAction;

    switch (type) {
      case "valider-vehicule":
        addVehicule(target);
        break;
      case "supprimer-vehicule":
        deleteVehicule(target.id);
        break;
      case "valider-email":
        addEmail(target.adresse);
        break;
      case "supprimer-email":
        deleteEmail(target.id);
        break;
      case "valider-entretien":
        addParametreEntretien(target);
        break;
      case "modifier-entretien":
        updateParametreEntretien(target);
        break;
      case "supprimer-entretien":
        deleteParametreEntretien(target.id);
        break;
      case "valider-utilisateur":
        addUtilisateur(target);
        break;
      case "supprimer-utilisateur":
        deleteUtilisateur(target.id);
        break;
      case "ajouter-conducteur":
        addConducteur(target);
        break;
      case "supprimer-conducteur":
        deleteConducteur(target.id);
        break;
      case "modifier-password":
        if (!currentUserId) return console.error("Aucun utilisateur connecté");
        updatePassword?.({
          id: Number(currentUserId),
          actuel: target.actuel,
          nouveau: target.nouveau,
        });
        break;
    }

    setConfirmAction(null);
  };

  if (isLoading) {
    return (
      <Loader
        message="Chargement des paramètres..."
        isLoading={isLoading}
        skeleton="none"
        fullscreen
      />
    );
  }

  return (
    <div className="min-h-screen p-6 flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 rounded-xl bg-white shadow p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Paramètres</h2>
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => handleTabClick(tab)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main avec animation */}
      <main className="flex-1 rounded-xl shadow border border-gray-200 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // relance l'animation à chaque changement d'onglet
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "Véhicules" && (
              <TabVehicules vehicules={vehicules} setConfirmAction={setConfirmAction} />
            )}
            {activeTab === "Emails" && <TabEmails setConfirmAction={setConfirmAction} />}
            {activeTab === "Paramètres entretien" && (
              <TabEntretien
                parametresEntretien={parametresEntretien}
                setConfirmAction={setConfirmAction}
              />
            )}
            {activeTab === "Utilisateurs" && (
              <TabUtilisateurs utilisateurs={utilisateurs} setConfirmAction={setConfirmAction} />
            )}
            {activeTab === "Mot de passe admin" && (
              <TabPassword setConfirmAction={setConfirmAction} />
            )}
            {activeTab === "Archivage" && <TabArchive />}
            {activeTab === "Conducteurs" && <TabConducteurs setConfirmAction={setConfirmAction} />}
            {activeTab === "Infos" && <TabEntreprise setConfirmAction={setConfirmAction} />}

          </motion.div>
        </AnimatePresence>

        {confirmAction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-xl p-6 w-1/3 shadow-lg">
              <h3 className="text-lg font-bold mb-4">
                {confirmAction.type.startsWith("supprimer")
                  ? "Confirmer la suppression"
                  : "Confirmer l'action"}
              </h3>
              <p className="mb-4">{getConfirmMessage(confirmAction)}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
