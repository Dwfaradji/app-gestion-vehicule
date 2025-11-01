// "use client";
//
// import { useState, useEffect, useCallback } from "react";
// import type { Notification } from "@/types/entretien";
//
// export function useNotifications() {
//   const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//
//   // 🔹 Ajouter une notification sans doublon
//   const addNotification = useCallback((notif: Notification) => {
//     if (!notif?.id) return;
//     setAllNotifications((prev) => {
//       const exists = prev.find(
//         (n) =>
//           n.id === notif.id ||
//           (n.vehicleId === notif.vehicleId && n.itemId === notif.itemId && n.type === notif.type),
//       );
//       if (exists) return prev;
//       return [{ ...notif, _new: true }, ...prev];
//     });
//   }, []);
//
//   // 🔹 Supprimer une notification
//   const removeNotification = useCallback((itemId: number, vehicleId: number, type: string) => {
//     setAllNotifications((prev) =>
//       prev.filter((n) => !(n.itemId === itemId && n.vehicleId === vehicleId && n.type === type)),
//     );
//   }, []);
//
//   // 🔹 Marquer comme lue
//   const markAsRead = useCallback(async (notif: Notification) => {
//     if (!notif?.id || notif.seen) return;
//     try {
//       const res = await fetch("/api/notifications/markAsRead", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: notif.id }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//
//       setAllNotifications((prev) =>
//         prev.map((n) => (n.id === notif.id ? { ...n, seen: true } : n)),
//       );
//     } catch (err) {
//       console.error("❌ markAsRead failed:", err);
//     }
//   }, []);
//
//   // 🔹 Animation terminée
//   const markAnimationDone = useCallback((id: number) => {
//     setAllNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, _new: false } : n)));
//   }, []);
//
//   // 🔹 Nouveau refreshAll amélioré
//   const refreshAll = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/notifications/refresh", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//
//       const data = await res.json();
//       const newList: Notification[] = Array.isArray(data.notifications) ? data.notifications : [];
//
//       setAllNotifications((prev) => {
//         const merged = [...prev];
//
//         for (const notif of newList) {
//           const existingIndex = merged.findIndex((n) => n.id === notif.id);
//           if (existingIndex !== -1) {
//             merged[existingIndex] = { ...merged[existingIndex], ...notif };
//           } else {
//             merged.unshift({ ...notif, new: true });
//           }
//         }
//
//         const validIds = newList.map((n) => n.id);
//
//         return merged
//           .filter((n) => validIds.includes(n.id))
//           .sort((a, b) => {
//             const dateA = a.date ? new Date(a.date).getTime() : 0;
//             const dateB = b.date ? new Date(b.date).getTime() : 0;
//             return dateB - dateA;
//           });
//       });
//     } catch (err) {
//       console.error("💥 refreshAll failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   // 🔹 Filtrer les notifications d’un véhicule
//   const getNotifByVehicle = useCallback(
//     (vehicleId: number) =>
//       allNotifications
//         .filter((n) => n.vehicleId === vehicleId)
//         .sort((a, b) => {
//           const dateA = a.date ? new Date(a.date).getTime() : 0;
//           const dateB = b.date ? new Date(b.date).getTime() : 0;
//           return dateB - dateA;
//         }),
//     [allNotifications],
//   );
//
//   // 🔹 SSE en temps réel
//   useEffect(() => {
//     const es = new EventSource("/api/notifications/stream");
//
//     es.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === "create" && data.notification) addNotification(data.notification);
//         if (data.type === "delete") removeNotification(data.itemId, data.vehicleId, data.notifType);
//         if (data.type === "refresh") refreshAll();
//       } catch (err) {
//         console.error("SSE parse error:", err);
//       }
//     };
//
//     es.onerror = (err) => {
//       console.error("SSE error:", err);
//       es.close();
//     };
//
//     return () => es.close();
//   }, [addNotification, removeNotification, refreshAll]);
//
//   // 🔹 Chargement initial
//   useEffect(() => {
//     refreshAll();
//   }, [refreshAll]);
//
//   return {
//     allNotifications,
//     notifications: allNotifications,
//     loading,
//     refreshAll,
//     markAsRead,
//     markAnimationDone,
//     addNotification,
//     removeNotification,
//     getNotifByVehicle, // ✅ Nouveau helper ici
//   };
// }
