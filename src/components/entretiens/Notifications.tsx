"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Bell, RefreshCw, AlertCircle } from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";

const Notifications = () => {
    const { allNotifications, markAsRead, markAnimationDone, refreshAll, loading } = useNotifications();
    const [open, setOpen] = useState(false);
    const [animatedIds, setAnimatedIds] = useState<number[]>([]);

    // Animation des nouvelles notifications
    const triggerAnimation = (id: number) => {
        setAnimatedIds(prev => [...prev, id]);
        setTimeout(() => {
            setAnimatedIds(prev => prev.filter(nid => nid !== id));
            markAnimationDone(id);
        }, 1000);
    };

    useEffect(() => {
        allNotifications.forEach(n => {
            if (n._new && !animatedIds.includes(n.id)) triggerAnimation(n.id);
        });
    }, [allNotifications, animatedIds, markAnimationDone]);

    // Trier par priorité puis par date
    const sortedNotifications = useMemo(() => {
        const priorityOrder = { urgent: 0, warning: 1, info: 2 } as const;
        return [...allNotifications].sort((a, b) => {
            if (priorityOrder[a.priority as keyof typeof priorityOrder] !==
                priorityOrder[b.priority as keyof typeof priorityOrder]) {
                return priorityOrder[a.priority as keyof typeof priorityOrder] -
                    priorityOrder[b.priority as keyof typeof priorityOrder];
            }
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [allNotifications]);

    const unreadCount = allNotifications.filter(n => !n.seen).length;

    const handleClickNotification = async (n: Notification) => {
        await markAsRead(n);
    };

    return (
        <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition relative cursor-pointer" onClick={() => setOpen(prev => !prev)}>
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-medium">Toutes les notifications</span>
                        <button onClick={refreshAll} className="p-1 rounded-full hover:bg-gray-100" title="Rafraîchir">
                            <RefreshCw className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>

                    {loading ? (
                        <p className="p-4 text-sm text-gray-500">Chargement...</p>
                    ) : sortedNotifications.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500">Aucune notification</p>
                    ) : (
                        <ul className="max-h-96 overflow-y-auto">
                            {sortedNotifications.map(n => (
                                <li
                                    key={n.id}
                                    className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                                        n.priority === "urgent"
                                            ? "bg-red-50 text-red-700"
                                            : n.priority === "warning"
                                                ? "bg-yellow-50 text-yellow-700"
                                                : "bg-blue-50 text-blue-700"
                                    } ${!n.seen ? "font-medium" : "opacity-70"} ${animatedIds.includes(n.id) ? "animate-fadeIn animate-highlight" : ""}`}
                                    onClick={() => handleClickNotification(n)}
                                >
                                    <span className="flex items-center gap-2">
                                        {n.priority === "urgent" && <AlertCircle className="h-4 w-4 text-red-500" />}
                                        {n.message}
                                    </span>
                                    <span className="text-xs text-gray-400">{new Date(n.date).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;