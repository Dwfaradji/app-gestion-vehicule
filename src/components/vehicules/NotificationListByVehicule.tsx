"use client";

import React from "react";
import type { Notification } from "@/types/entretien";

interface NotificationsListProps {
  notifications: Notification[];
  markAsRead: (n: Notification) => void;
}

export default function NotificationsListByVehicule({
  notifications,
  markAsRead,
}: NotificationsListProps) {
  if (notifications.length === 0) return null;

  const getIcon = (priority: string) => {
    switch (priority) {
      case "warning":
        return (
          <svg
            className="w-5 h-5 text-yellow-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8.257 3.099c.765-1.36 2.68-1.36 3.445 0l6.518 11.593c.75 1.334-.213 2.908-1.722 2.908H3.46c-1.51 0-2.472-1.574-1.723-2.908L8.257 3.1zM11 13h-2v-2h2v2zm0-4h-2V7h2v2z" />
          </svg>
        );
      case "urgent":
        return (
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5h-2v2h2zm0 6v-4h-2v4h2z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-blue-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zM9 7h2v5H9V7zm0 6h2v2H9v-2z" />
          </svg>
        );
    }
  };

  const getColors = (priority: string) => {
    switch (priority) {
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "urgent":
        return "bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-hidden">
      <ul className="max-h-80 overflow-y-auto space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            onClick={() => markAsRead(n)}
            className={`flex justify-between items-center p-3 rounded-xl ${getColors(
              n.priority,
            )} cursor-pointer transition-all duration-500 ease-out transform ${
              n.new ? "opacity-0 -translate-y-2 animate-fadeSlide" : ""
            }`}
          >
            <span className="flex items-center gap-3 overflow-hidden">
              {getIcon(n.priority)}
              <span className="font-medium truncate">{n.message}</span>
            </span>
            <span className="flex items-center gap-2">
              {!n.seen && (
                <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs font-semibold animate-bounce shadow-sm flex-shrink-0">
                  Nouveau
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-300 flex-shrink-0">
                {new Date(n.createdAt || "").toLocaleDateString()}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
