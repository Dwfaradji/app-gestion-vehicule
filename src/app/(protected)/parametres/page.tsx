"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// Components
import Loader from "@/components/layout/Loader";
import TabVehicules from "@/components/vehicules/TabVehicule";
import TabEmails from "@/components/emails/TabEmails";
import TabEntretien from "@/components/entretiens/TabEntretien";
import TabUtilisateurs from "@/components/utilisateurs/TabUtilisateurs";
import TabPassword from "@/components/utilisateurs/TabPassword";
import TabArchive from "@/components/utilisateurs/TabArchive";
import TabConducteurs from "@/components/utilisateurs/TabConducteurs";
import TabEntreprise from "@/components/utilisateurs/TabEntreprise";

import { useGlobalLoading } from "@/hooks/useGlobalLoading";

// 🧩 Type des onglets
type Onglet =
  | "Véhicules"
  | "Emails"
  | "Mot de passe admin"
  | "Paramètres entretien"
  | "Utilisateurs"
  | "Archivage"
  | "Conducteurs"
  | "Infos";

const TABS: Onglet[] = [
  "Véhicules",
  "Emails",
  "Mot de passe admin",
  "Paramètres entretien",
  "Utilisateurs",
  "Archivage",
  "Conducteurs",
  "Infos",
];

export default function ParametresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoading = useGlobalLoading();

  // 🧭 Lecture du paramètre "tab" et validation
  const tabParam = searchParams.get("tab") as Onglet | null;
  const initialTab: Onglet = TABS.includes(tabParam as Onglet) ? (tabParam as Onglet) : "Véhicules"; // valeur par défaut sûre et typée

  const [activeTab, setActiveTab] = useState<Onglet>(initialTab);

  // 🧩 Changement d’onglet
  const handleTabClick = (tab: Onglet) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 💡 Contenu dynamique selon l’onglet
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "Véhicules":
        return <TabVehicules />;
      case "Emails":
        return <TabEmails />;
      case "Paramètres entretien":
        return <TabEntretien />;
      case "Utilisateurs":
        return <TabUtilisateurs />;
      case "Mot de passe admin":
        return <TabPassword />;
      case "Archivage":
        return <TabArchive />;
      case "Conducteurs":
        return <TabConducteurs />;
      case "Infos":
        return <TabEntreprise />;
      default:
        return null;
    }
  }, [activeTab]);

  // 🌀 Loader global
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

  // 🧱 Rendu principal
  return (
    <div className="min-h-screen p-6 flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 rounded-xl bg-white shadow p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Paramètres</h2>
        <ul className="space-y-2">
          {TABS.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => handleTabClick(tab)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
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

      {/* Contenu principal */}
      <main className="flex-1 rounded-xl shadow border border-gray-200 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {tabContent}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
