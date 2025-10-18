"use client";

import { AlertCircle } from "lucide-react";
import { Notification } from "@/types/entretien";
import Modal from "@/components/ui/Modal";
import React from "react";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  markAsRead: (n: Notification) => Promise<void>;
  animatedIds: number[];
}

const NotificationsModal = ({
  isOpen,
  onClose,
  notifications,
  markAsRead,
  animatedIds,
}: NotificationsModalProps) => {
  const handleClick = async (e: React.MouseEvent, n: Notification) => {
    e.stopPropagation();
    if (!n.seen) {
      await markAsRead(n);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium">Toutes les notifications</span>
      </div>
      <ul className="overflow-y-auto max-h-[60vh] px-2 py-2 flex-1 space-y-1">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between rounded-md hover:bg-gray-100 dark:hover:bg-gray-700
              ${!n.seen ? "font-medium bg-gray-50 dark:bg-gray-700" : "opacity-80"}
              ${animatedIds.includes(n.id as number) ? "animate-fadeIn animate-highlight" : ""}`}
            onClick={(e) => handleClick(e, n)}
          >
            <span className="flex items-center gap-2">
              {n.priority === "urgent" && <AlertCircle className="h-4 w-4 text-red-500" />}
              {n.message}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-300">
              {new Date(n.date as string).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default NotificationsModal;
