"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Vehicule } from "@/types/vehicule";
import { ParametreEntretien, Notification } from "@/types/entretien";
import { generateNotifications } from "@/utils/vehiculeNotifications";
import { maintenanceParams } from "@/data/maintenanceParams";
import { generateMaintenanceNotifications, Notification as MaintenanceNotification } from "@/utils/generateMaintenanceNotifications";

interface NotificationsContextProps {
    notifications: Notification[];
    markAsRead: (idx: number) => void;
    refreshNotifications: (vehicules: Vehicule[], parametres: ParametreEntretien[]) => void;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const markAsRead = useCallback((idx: number) => {
        setNotifications(prev => {
            const newNotifications = [...prev];
            newNotifications[idx].seen = true;
            return newNotifications;
        });
    }, []);

    const refreshNotifications = useCallback(
        (vehicules: Vehicule[], parametres: ParametreEntretien[]) => {
            // 🔹 Notifications CT et seuils d’entretien existants
            const baseNotifications = generateNotifications(vehicules, parametres);

            // 🔹 Notifications mécaniques détaillées
            const mechNotifications: MaintenanceNotification[] = generateMaintenanceNotifications(
                vehicules,
                maintenanceParams
            );

            // 🔹 Fusion et tri par priorité (urgent > moyen > normal)
            const allNotifications: Notification[] = [
                ...baseNotifications,
                ...mechNotifications.map(n => ({
                    id: n.id,
                    vehicleId: n.vehicleId,
                    type: n.type,
                    message: n.message,
                    km: n.km,
                    priority: n.priority,
                    seen: n.seen ?? false,
                    date: new Date().toISOString(), // timestamp actuel
                })),
            ];

            setNotifications(allNotifications);
        },
        []
    );

    return (
        <NotificationsContext.Provider value={{ notifications, markAsRead, refreshNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationsProvider");
    }
    return context;
};