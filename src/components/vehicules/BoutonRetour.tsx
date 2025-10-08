"use client";

import { Home, Settings, Truck, List, DollarSign } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BoutonRetour = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [label, setLabel] = useState("Accueil");
    const [Icon, setIcon] = useState<typeof Home>(Home);
    const [target, setTarget] = useState("/vehicules");
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        let newLabel = "Accueil";
        let NewIcon = Home;
        let newTarget = "/vehicules";
        let isDisabled = false;

        if (pathname.startsWith("/vehicules/depenses")) {
            newLabel = "Dépenses";
            NewIcon = DollarSign;
            newTarget = target;
        } else if (pathname.startsWith("/gestions-trajet")) {
            newLabel = "Gestion Trajets";
            NewIcon = List;
            newTarget = target;
            isDisabled = true; // racine → pas de retour
        } else if (pathname.startsWith("/details-trajet")) {
            newLabel = "Détails Trajet";
            NewIcon = Truck;
            newTarget = target; // retour vers gestion trajet
        } else if (pathname.startsWith("/vehicules/")) {
            newLabel = "Véhicules";
            NewIcon = Truck;
            newTarget = target;
        } else if (pathname.startsWith("/parametres")) {
            newLabel = "Paramètres";
            NewIcon = Settings;
            newTarget = target;
        } else if (pathname === "/vehicules") {
            newLabel = "Dashboard";
            NewIcon = List;
            newTarget = target;
            isDisabled = true; // racine → pas de retour
        }

        setLabel(newLabel);
        setIcon(NewIcon);
        setTarget(newTarget);
        setDisabled(isDisabled);

        // Si ce n’est pas une racine, changer label en "Retour"
        if (!isDisabled) {
            const timer = setTimeout(() => setLabel("Retour"), 1500);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    return (
        <button
            onClick={() => !disabled && router.push(target)}
            disabled={disabled}
            className={`
        flex items-center gap-2 rounded-xl
        bg-gradient-to-r from-blue-500 to-blue-600
        text-white font-semibold px-4 py-2 shadow-md
        hover:shadow-lg hover:scale-105
        transition transform duration-300 cursor-pointer
        ${disabled ? "opacity-60 cursor-default hover:shadow-md hover:scale-100" : ""}
      `}
        >
            <Icon className="h-5 w-5" />
            <AnimatePresence mode="wait">
                <motion.span
                    key={label}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                >
                    {label}
                </motion.span>
            </AnimatePresence>
        </button>
    );
};

export default BoutonRetour;