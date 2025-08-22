"use client";

import { Bell, Settings, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationsContext";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Logout from "@/components/Logout";
import { useData } from "@/context/DataContext";
import BoutonAccueil from "@/components/BoutonRetour";


const Header = () => {
    const { vehicules } = useData();
    const router = useRouter();
    const { notifications, refreshNotifications, markAsRead } = useNotifications();
    const [openDropdown, setOpenDropdown] = useState(false);

    const { data: session } = useSession();

    const sortedNotifications = useMemo(() => {
        const priorityOrder = { urgent: 1, moyen: 2, normal: 3 };
        return [...notifications].sort(
            (a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
        );
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.seen).length;
    const urgentCount = notifications.filter(n => n.priority === "urgent" && !n.seen).length;

    useEffect(() => {
        if (vehicules) refreshNotifications(vehicules, []);
    }, [vehicules, refreshNotifications]);

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200 relative">
            {/* Logo + Bouton Accueil */}
            <div className="flex items-center gap-4">
                <BoutonAccueil/>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        className="relative p-2 rounded-full hover:bg-gray-100 transition"
                        onClick={() => setOpenDropdown(!openDropdown)}
                    >
                        <Bell className="h-6 w-6 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {openDropdown && (
                        <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
                            <h3 className="px-4 py-2 font-semibold border-b border-gray-200 text-gray-700">
                                Notifications
                            </h3>
                            <ul className="max-h-64 overflow-y-auto">
                                {sortedNotifications.length === 0 && (
                                    <li className="px-4 py-2 text-sm text-gray-500">
                                        Aucune notification
                                    </li>
                                )}
                                {sortedNotifications.map((n, idx) => {
                                    let bgColor = "bg-gray-50", textColor = "text-gray-700";
                                    if (n.priority === "urgent") { bgColor = "bg-red-100"; textColor = "text-red-700"; }
                                    else if (n.priority === "moyen") { bgColor = "bg-yellow-100"; textColor = "text-yellow-700"; }

                                    return (
                                        <li
                                            key={idx}
                                            className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 ${bgColor} ${textColor} ${
                                                !n.seen ? "font-medium" : "opacity-70"
                                            }`}
                                            onClick={() => markAsRead(idx)}
                                        >
                                            <span className="flex items-center gap-2">
                                                {n.priority === "urgent" && <AlertCircle className="h-4 w-4 text-red-500" />}
                                                {n.message}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Paramètres */}
                {session?.user?.role === "ADMIN" && (
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        onClick={() => router.push("/parametres")}
                    >
                        <Settings className="h-6 w-6 text-gray-600" />
                    </button>
                )}

                {/* Déconnexion */}
                <Logout />
            </div>
        </header>
    );
};

export default Header;