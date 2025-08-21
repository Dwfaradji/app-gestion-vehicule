"use client";

import { Home, Settings, Truck, List } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BoutonAccueil = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [label, setLabel] = useState("Accueil");
    const [Icon, setIcon] = useState(Home);
    const [target, setTarget] = useState("/");

    useEffect(() => {
        let newLabel = "Accueil";
        let NewIcon = Home;
        let newTarget = "/vehicules"; // par défaut

        if (pathname.startsWith("/vehicules/")) {
            newLabel = "Véhicules";
            NewIcon = Truck;
            newTarget = "/vehicules";
        } else if (pathname.startsWith("/parametres")) {
            newLabel = "Paramètres";
            NewIcon = Settings;
            newTarget = "/parametres";
        } else if (pathname === "/vehicules") {
            newLabel = "Dashboard";
            NewIcon = List;
            newTarget = "/vehicules";
        }

        setLabel(newLabel);
        setIcon(() => NewIcon);
        setTarget(newTarget);

        // ⏳ Animation vers "Retour" sauf Dashboard
        if (pathname !== "/vehicules") {
            const timer = setTimeout(() => {
                setLabel(" Retour");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    return (
        <button
            onClick={() => router.push("/vehicules")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-4 py-2 shadow-md hover:shadow-lg hover:scale-105 transition transform"
        >
            <Icon className="h-5 w-5" />
            <AnimatePresence mode="wait">
                <motion.span
                    key={label} // 🔑 permet à Framer Motion de détecter le changement
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

export default BoutonAccueil;