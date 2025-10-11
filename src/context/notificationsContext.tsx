// "use client";
//
// import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
//
// export interface Notification {
//     id?: number;
//     vehicleId?: number;
//     itemId?: number; // ⚡️ référence la pièce/intervention
//     message: string;
//     priority: "normal" | "urgent";
//     seen: boolean;
//     type: string;
//     date: string;
//     km?: number;
// }
//
// interface NotificationContextType {
//     notifications: Notification[];
//     sendNotification: (n: Notification[]) => Promise<void>;
//     deleteNotification: (id: number) => Promise<void>;
//     removeNotificationByItemId: (vehicleId: number, type: string, itemId: number) => Promise<void>;
//     clearNotifications: () => void;
// }
//
// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
//
// export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
//     const [notifications, setNotifications] = useState<Notification[]>([]);
//
//
//     const sendNotification = async (n: Notification) => {
//         console.log(n,"notif post api")
//         await fetch("/api/notifications/send", {
//             method: "POST",
//             body: JSON.stringify(n),
//         });
//     };
//
//
//     // 🔹 Récupérer notifications existantes
//     useEffect(() => {
//         const fetchNotifications = async () => {
//             try {
//                 const res = await fetch("/api/notifications/list",{
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({}),
//                 });
//                 if (res.ok) {
//                     const data: Notification[] = await res.json();
//                     setNotifications(data);
//                 }
//             } catch (err) {
//                 console.error(err);
//             }
//         };
//         fetchNotifications();
//     }, []);
//
//     // 🔹 SSE pour recevoir nouvelles notifications en direct
//     // useEffect(() => {
//     //     const evtSource = new EventSource("/api/notifications/stream");
//     //
//     //     evtSource.onmessage = (event) => {
//     //         try {
//     //             const data = JSON.parse(event.data);
//     //
//     //             if (data.type === "create") {
//     //                 setNotifications((prev) => [data.notification, ...prev]);
//     //             } else if (data.type === "delete") {
//     //                 setNotifications((prev) =>
//     //                     prev.filter(
//     //                         (n) =>
//     //                             !(
//     //                                 n.vehicleId === data.vehicleId &&
//     //                                 n.itemId === data.itemId &&
//     //                                 n.type === data.notifType
//     //                             )
//     //                     )
//     //                 );
//     //             }
//     //         } catch (err) {
//     //             console.error("Erreur SSE :", err);
//     //         }
//     //     };
//     //
//     //     evtSource.onerror = (err) => {
//     //         console.error("Erreur EventSource :", err);
//     //         evtSource.close();
//     //     };
//     //
//     //     return () => evtSource.close();
//     // }, []);
//
//
//     // const deleteNotification = async (id: number) => {
//     //     setNotifications((prev) => prev.filter((n) => n.id !== id));
//     //     await fetch(`/api/notifications/${id}`, { method: "DELETE" });
//     // };
//     //
//     // const removeNotificationByItemId = async (vehicleId: number, type: string, itemId: number) => {
//     //     const res = await fetch("/api/notifications/remove", {
//     //         method: "POST",
//     //         headers: { "Content-Type": "application/json" },
//     //         body: JSON.stringify({ vehicleId, type, itemId }),
//     //     });
//     //
//     //     if (res.ok) {
//     //         setNotifications((prev) =>
//     //             prev.filter((n) => !(n.vehicleId === vehicleId && n.type === type && n.itemId === itemId))
//     //         );
//     //     }
//     // };
//     //
//     // const clearNotifications = () => setNotifications([]);
//
//     return (
//         <NotificationContext.Provider
//             value={{ notifications, sendNotification, deleteNotification, removeNotificationByItemId, clearNotifications }}
//         >
//             {children}
//         </NotificationContext.Provider>
//     );
// };
//
// export const useNotificationContext = () => {
//     const ctx = useContext(NotificationContext);
//     if (!ctx) throw new Error("useNotificationContext must be used within NotificationsProvider");
//     return ctx;
// };
