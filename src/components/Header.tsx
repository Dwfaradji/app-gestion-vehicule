"use client";

import { Bell, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationsContext";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Logout from "@/components/Logout";
import { useData } from "@/context/DataContext";

const Header = () => {
    const { vehicules } = useData();
    const router = useRouter();
    const { notifications, refreshNotifications, markAsRead } = useNotifications();
    const [openDropdown, setOpenDropdown] = useState(false);

    const { data: session } = useSession(); // récupération de la session

    // Paramètres exemples
    const parametres = useMemo(() => [
        { type: "Freins", seuilKm: 15000, dernierKm: 70000 },
        { type: "Vidange", seuilKm: 10000, dernierKm: 80000 },
        { type: "CT", seuilKm: 0 },
    ], []);

    useEffect(() => {
        if (vehicules && parametres) {
            refreshNotifications(vehicules, parametres);
        }
    }, [vehicules, parametres, refreshNotifications]);

    const unreadCount = notifications.filter(n => !n.seen).length;

    return (
        <div>
            <header className="mb-6 flex items-center justify-between relative">
                <Logout/>
                <div className="flex gap-4 relative">
                    {/* Notifications */}
                    <button
                        className="relative rounded-full p-2 hover:bg-gray-100"
                        onClick={() => setOpenDropdown(!openDropdown)}
                    >
                        <Bell className="h-5 w-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {openDropdown && (
                        <div className="absolute right-0 mt-10 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                            <h3 className="px-4 py-2 font-semibold border-b border-gray-200">Notifications</h3>
                            <ul className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 && (
                                    <li className="px-4 py-2 text-sm text-gray-500">Aucune notification</li>
                                )}
                                {notifications.map((n, idx) => (
                                    <li
                                        key={idx}
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${!n.seen ? "font-medium" : "text-gray-500"}`}
                                        onClick={() => markAsRead(idx)}
                                    >
                                        {n.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Paramètres - visible uniquement si admin */}
                    {session?.user?.role === "ADMIN" && (
                        <button className="rounded-full p-2 hover:bg-gray-100" onClick={() => router.push("/parametres")}>
                            <Settings className="h-5 w-5 text-gray-600" />
                        </button>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;