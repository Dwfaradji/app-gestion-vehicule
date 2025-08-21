"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Vehicule } from "@/types/vehicule";
import { ParametreEntretien, Notification } from "@/types/entretien";
import { generateNotifications } from "@/utils/vehiculeNotifications";

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
            const generated = generateNotifications(vehicules, parametres);
            setNotifications(generated);
        },
        [] // stable, ne change jamais
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