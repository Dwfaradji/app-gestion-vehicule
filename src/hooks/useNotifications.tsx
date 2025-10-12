"use client";

import { useState, useEffect, useCallback } from "react";
import type { Notification } from "@/types/entretien";

export function useNotifications() {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ajouter une notification sans doublon
  const addNotification = useCallback((notif: Notification) => {
    setAllNotifications((prev) => {
      const exists = prev.find(
        (n) =>
          n.vehicleId === notif.vehicleId && n.itemId === notif.itemId && n.type === notif.type,
      );
      if (exists) return prev;
      return [{ ...notif, _new: true }, ...prev];
    });
  }, []);

  // 🔹 Supprimer une notification
  const removeNotification = useCallback((itemId: number, vehicleId: number, type: string) => {
    setAllNotifications((prev) =>
      prev.filter((n) => !(n.itemId === itemId && n.vehicleId === vehicleId && n.type === type)),
    );
  }, []);

  // 🔹 Marquer comme lu
  const markAsRead = useCallback(async (notif: Notification) => {
    if (notif.seen) return;
    try {
      const res = await fetch("/api/notifications/markAsRead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notif.id }),
      });
      if (!res.ok) throw new Error(await res.text());
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, seen: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 🔹 Marquer animation comme terminée
  const markAnimationDone = useCallback((id: number) => {
    setAllNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, _new: false } : n)));
  }, []);

  // 🔹 Rafraîchir toutes les notifications
  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { method: "GET" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAllNotifications(data.notifications || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Rafraîchir notifications d’un véhicule spécifique
  const refreshVehicle = useCallback(async (vehicleId: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId }),
      });
      if (!res.ok)  new Error(await res.text());
      const data = await res.json();
      setAllNotifications((prev) => {
        // Met à jour global sans dupliquer
        const others = prev.filter((n) => n.vehicleId !== vehicleId);
        return [...others, ...(data.notifications || [])];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Filtrer par véhicule
  const getByVehicle = useCallback(
    (vehicleId: number) => allNotifications.filter((n) => n.vehicleId === vehicleId),
    [allNotifications],
  );

  // 🔹 SSE pour updates en temps réel
  useEffect(() => {
    refreshAll();
    const es = new EventSource("/api/notifications/stream");

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "create" && data.notification) addNotification(data.notification);
        if (data.type === "delete") removeNotification(data.itemId, data.vehicleId, data.notifType);
        if (data.type === "refresh") refreshVehicle(data.vehicleId);
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE error:", err);
      es.close();
    };

    return () => es.close();
  }, [addNotification, removeNotification, refreshAll, refreshVehicle]);

  return {
    allNotifications,
    notifications: allNotifications,
    getByVehicle,
    loading,
    refreshAll,
    refreshVehicle,
    markAsRead,
    markAnimationDone,
    addNotification,
    removeNotification,
  };
}
