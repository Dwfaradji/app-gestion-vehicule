"use client";

import NotificationsDropdown from "@/components/entretiens/NotificationsDropdown";
import NotificationsModal from "@/components/entretiens/NotificationsModal";
import { useEffect, useMemo, useState } from "react";
import { useNotifications } from "@/context/notificationsContext";

interface NotificationsProps {
  mode: "modal" | "dropdown";
  isOpen?: boolean;
  onClose?: () => void;
  onCountChange?: (count: number) => void; // ← callback pour informer le parent
}

export const Notifications = ({ mode, isOpen, onClose, onCountChange }: NotificationsProps) => {
  const { allNotifications, markAsRead, markAnimationDone, refreshAll } = useNotifications();
  const [animatedIds, setAnimatedIds] = useState<number[]>([]);

  // Animation des nouvelles notifications
  useEffect(() => {
    const triggerAnimation = (id: number) => {
      setAnimatedIds((prev) => [...prev, id]);
    };

    allNotifications.forEach((n) => {
      if (n.new && !n.seen && n.id !== undefined && !animatedIds.includes(n.id)) {
        triggerAnimation(n.id);
      }
    });
  }, [allNotifications, animatedIds, markAnimationDone]);

  // Compteur non-lues
  const unreadCount = useMemo(
    () => allNotifications.filter((n) => !n.seen).length,
    [allNotifications],
  );

  // 🔁 Informer le parent à chaque changement
  useEffect(() => {
    if (onCountChange) onCountChange(unreadCount);
  }, [unreadCount, onCountChange]);

  // Tri
  const sortedNotifications = useMemo(() => {
    const priorityOrder = { urgent: 0, warning: 1, info: 2 } as const;
    return [...allNotifications].sort((a, b) => {
      if (
        priorityOrder[a.priority as keyof typeof priorityOrder] !==
        priorityOrder[b.priority as keyof typeof priorityOrder]
      ) {
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        );
      }
      return new Date(b.date as string).getTime() - new Date(a.date as string).getTime();
    });
  }, [allNotifications]);

  if (mode === "modal") {
    return (
      <NotificationsModal
        isOpen={isOpen!}
        onClose={onClose!}
        notifications={sortedNotifications}
        markAsRead={markAsRead}
        animatedIds={animatedIds}
      />
    );
  }

  return (
    <NotificationsDropdown
      notifications={sortedNotifications}
      markAsRead={markAsRead}
      refreshAll={refreshAll}
      animatedIds={animatedIds}
    />
  );
};
