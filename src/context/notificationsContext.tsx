"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import type { Notification } from "@/types/entretien";
import { api } from "@/lib/api";

// Safe time extractor for optional ISO strings
function safeTime(date?: string): number {
  return date ? Date.parse(date) || 0 : 0;
}

interface NotificationsContextType {
  allNotifications: Notification[];
  loading: boolean;

  addNotification: (notif: Notification) => void;
  removeNotification: (itemId: number, vehicleId: number, type: string) => void;
  markAsRead: (notif: Notification) => Promise<void>;
  markAnimationDone: (id: number) => void;
  refreshAll: () => Promise<void>;
  getNotifByVehicle: (vehicleId: number) => Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ajouter notification sans doublon
  const addNotification = useCallback((notif: Notification) => {
    if (!notif?.id) return;
    setAllNotifications((prev) => {
      const exists = prev.find(
        (n) =>
          n.id === notif.id ||
          (n.vehicleId === notif.vehicleId && n.itemId === notif.itemId && n.type === notif.type),
      );
      if (exists) return prev;
      return [{ ...notif, _new: true }, ...prev];
    });
    toast.success("Nouvelle notification");
  }, []);

  // 🔹 Supprimer notification
  const removeNotification = useCallback((itemId: number, vehicleId: number, type: string) => {
    setAllNotifications((prev) =>
      prev.filter((n) => !(n.itemId === itemId && n.vehicleId === vehicleId && n.type === type)),
    );
  }, []);

  // 🔹 Marquer comme lue
  const markAsRead = useCallback(async (notif: Notification) => {
    if (!notif?.id || notif.seen) return;
    try {
      await api(`/api/notifications/markAsRead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notif.id }),
      });
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, seen: true } : n)),
      );
    } catch (err) {
      console.error("❌ markAsRead failed:", err);
      toast.error("Impossible de marquer la notification comme lue");
    }
  }, []);

  // 🔹 Animation terminée
  const markAnimationDone = useCallback((id: number) => {
    setAllNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, _new: false } : n)));
  }, []);

  // 🔹 Refresh notifications
  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ notifications: Notification[] }>("/api/notifications/refresh", {
        method: "POST",
      });
      const newList = data.notifications ?? [];

      setAllNotifications((prev) => {
        const merged = [...prev];
        for (const notif of newList) {
          const idx = merged.findIndex((n) => n.id === notif.id);
          if (idx !== -1) merged[idx] = { ...merged[idx], ...notif };
          else merged.unshift({ ...notif, new: true });
        }

        const validIds = newList.map((n) => n.id);
        return merged
          .filter((n) => validIds.includes(n.id))
          .sort((a, b) => safeTime(b.date) - safeTime(a.date));
      });
    } catch (err) {
      console.error("💥 refreshAll failed:", err);
      toast.error("Erreur lors du rafraîchissement des notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Filtrer notifications par véhicule
  const getNotifByVehicle = useCallback(
    (vehicleId: number) =>
      allNotifications
        .filter((n) => n.vehicleId === vehicleId)
        .sort((a, b) => safeTime(b.date) - safeTime(a.date)), 
    [allNotifications],
  );

  // 🔹 SSE en temps réel
  useEffect(() => {
    const es = new EventSource("/api/notifications/stream");

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "create" && data.notification) addNotification(data.notification);
        if (data.type === "delete") removeNotification(data.itemId, data.vehicleId, data.notifType);
        if (data.type === "refresh") refreshAll();
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE error:", err);
      es.close();
    };

    return () => es.close();
  }, [addNotification, removeNotification, refreshAll]);

  // 🔹 Chargement initial
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <NotificationsContext.Provider
      value={{
        allNotifications,
        loading,
        addNotification,
        removeNotification,
        markAsRead,
        markAnimationDone,
        refreshAll,
        getNotifByVehicle,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error("useNotifications doit être utilisé à l’intérieur d’un NotificationsProvider");
  return context;
}
