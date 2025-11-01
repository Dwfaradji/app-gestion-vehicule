"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BoutonRetour = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [label, setLabel] = useState("Accueil");

  useEffect(() => {
    let pageLabel = "Accueil";
    if (pathname.startsWith("/vehicules/depenses")) pageLabel = "Dépenses";
    else if (pathname.startsWith("/gestions-trajet")) pageLabel = "Gestion Trajets";
    else if (pathname.startsWith("/details-trajet")) pageLabel = "Détails Trajet";
    else if (pathname.startsWith("/vehicules")) pageLabel = "Véhicules";
    else if (pathname.startsWith("/parametres")) pageLabel = "Paramètres";
    else if (pathname.startsWith("/statistiques-trajets")) pageLabel = "Statistiques";
    else if (pathname === "/dashboard/") pageLabel = "Dashboard";

    // On attend la frame avant de définir le texte initial
    const frameId = requestAnimationFrame(() => setLabel(pageLabel));

    // Après 2 secondes → passe à "Retour"
    const timer = setTimeout(() => setLabel("Retour"), 2000);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [pathname]);

  const widthClass = "min-w-[160px] md:min-w-[180px] lg:min-w-[200px]";

  return (
    <div className="relative flex items-center">
      <div
        onClick={() => router.back()}
        className={`
          ${widthClass} flex items-center justify-center gap-3       
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

        {/* Icône affichée uniquement quand le texte = "Retour" */}
        <AnimatePresence>
          {label === "Retour" && (
            <motion.span
              key="arrow"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.25 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>

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
      </div>
    </div>
  );
};

export default BoutonRetour;
