"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Truck, List, DollarSign, Settings, Mail, User, Bell, Calendar } from "lucide-react";
import { useVehicules } from "@/context/vehiculesContext";
import { useDepenses } from "@/context/depensesContext";
import { useTrajets } from "@/context/trajetsContext";
import { useEmails } from "@/context/emailsContext";
import { useState, useMemo } from "react";
import { Notifications } from "@/components/entretiens/Notifications";

const Dashboard = () => {
  const router = useRouter();
  const { vehicules, loading: loadingVehicules } = useVehicules();
  const { depenses, loading: loadingDepenses } = useDepenses();
  const { trajets, conducteurs, planifications, loading: loadingTrajets } = useTrajets();
  const { emails, loading: loadingEmails } = useEmails();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const cards = useMemo(
    () => [
      {
        title: "Véhicules",
        icon: Truck,
        description: "Gérez et suivez vos véhicules.",
        color: "from-blue-500 to-blue-600",
        count: loadingVehicules ? "..." : vehicules.length,
        path: "/vehicules",
      },
      {
        title: "Trajets",
        icon: List,
        description: "Suivez les trajets et conducteurs.",
        color: "from-indigo-500 to-purple-600",
        count: loadingTrajets ? "..." : trajets.length,
        path: "/gestions-trajet",
      },
      {
        title: "Planification",
        icon: Calendar,
        description: "Gérez les plannings de votre flotte.",
        color: "from-teal-500 to-emerald-600",
        count: loadingTrajets ? "..." : planifications.length,
        path: "/planification",
      },
      {
        title: "Dépenses",
        icon: DollarSign,
        description: "Analysez les dépenses de votre flotte.",
        color: "from-emerald-500 to-teal-600",
        count: loadingDepenses ? "..." : depenses.length,
        path: "/vehicules/depenses",
      },
      {
        title: "Conducteurs",
        icon: User,
        description: "Gérez vos conducteurs.",
        color: "from-orange-500 to-pink-600",
        count: loadingTrajets ? "..." : conducteurs.length,
        path: "/parametres?tab=Conducteurs",
      },
      {
        title: "Emails",
        icon: Mail,
        description: "Gérez vos adresses et notifications.",
        color: "from-cyan-500 to-sky-600",
        count: loadingEmails ? "..." : emails.length,
        path: "/parametres?tab=Emails",
      },
      {
        title: "Notifications",
        icon: Bell,
        description: "Voir toutes les notifications.",
        color: "from-red-500 to-pink-500",
        isNotification: true,
        count: notifCount,
      },
      {
        title: "Paramètres",
        icon: Settings,
        description: "Configurez l’application.",
        color: "from-gray-600 to-gray-800",
        path: "/parametres",
      },
    ],
    [
      vehicules,
      trajets,
      conducteurs,
      planifications,
      depenses,
      emails,
      loadingVehicules,
      loadingTrajets,
      loadingDepenses,
      loadingEmails,
      notifCount,
    ],
  );

  return (
    <div
      className={
        "min-h-screen transition-colors duration-500  dark:bg-gray-900 dark:text-gray-100 bg-gray-50 text-gray-800"
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-300 dark:border-gray-700 ">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold flex items-center gap-2"
        >
          Tableau de bord
        </motion.h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-11/12 max-w-6xl mx-auto mt-12 pb-16">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() =>
              card.isNotification ? setNotifOpen((prev) => !prev) : router.push(String(card.path))
            }
            className={`cursor-pointer rounded-2xl shadow-lg relative overflow-hidden transition-all bg-gradient-to-r ${card.color} text-white p-6 group`}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <card.icon className="w-10 h-10" />
              {card.count !== undefined && (
                <motion.span
                  key={card.count}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold bg-white/20 px-3 py-1 rounded-lg"
                >
                  {card.count}
                </motion.span>
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-sm text-white/90"> {card.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Notifications Modal */}
      <Notifications
        mode="modal"
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        onCountChange={setNotifCount}
      />
    </div>
  );
};

export default Dashboard;
