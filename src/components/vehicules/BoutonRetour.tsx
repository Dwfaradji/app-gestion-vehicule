"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BoutonRetour = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [label, setLabel] = useState("Accueil");

  // Déterminer le label de la page
  useEffect(() => {
    let pageLabel = "Accueil";
    if (pathname.startsWith("/vehicules/depenses")) pageLabel = "Dépenses";
    else if (pathname.startsWith("/gestions-trajet")) pageLabel = "Gestion Trajets";
    else if (pathname.startsWith("/details-trajet")) pageLabel = "Détails Trajet";
    else if (pathname.startsWith("/vehicules")) pageLabel = "Véhicules";
    else if (pathname.startsWith("/parametres")) pageLabel = "Paramètres";
    else if (pathname.startsWith("/statistiques-trajets")) pageLabel = "Statistiques";
    else if (pathname === "/dashboard/") pageLabel = "Dashboard";

    setLabel(pageLabel);

    const timer = setTimeout(() => setLabel("Retour"), 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  const widthClass = "min-w-[160px] md:min-w-[180px] lg:min-w-[200px]";

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => router.back()}
        className={`
          ${widthClass} flex items-center justify-center gap-3 rounded-xl
          bg-gradient-to-r from-blue-500 to-blue-600
          text-white font-semibold px-4 py-2 shadow-lg
          transition transform duration-300 cursor-pointer
        `}
      >
        {/* Glow animé à gauche */}
        <motion.span
          className="absolute left-3 h-3 w-3 rounded-full bg-white/80 shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]"
          animate={{
            scale: [0.9, 1.3, 0.9],
            opacity: [0.8, 1, 0.8],
            boxShadow: [
              "0 0 6px 2px rgba(255,255,255,0.5)",
              "0 0 14px 4px rgba(255,255,255,0.8)",
              "0 0 6px 2px rgba(255,255,255,0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Icône */}
        <ArrowLeft className="h-5 w-5" />

        {/* Texte animé */}
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
};

export default BoutonRetour;
