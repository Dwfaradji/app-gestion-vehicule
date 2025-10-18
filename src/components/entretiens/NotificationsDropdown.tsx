"use client";

import { useRef, useState, useEffect } from "react";
import { Bell, RefreshCw, AlertCircle } from "lucide-react";
import { Notification } from "@/types/entretien";

interface NotificationsDropdownProps {
  notifications: Notification[];
  markAsRead: (n: Notification) => Promise<void>;
  refreshAll: () => void;
  animatedIds: number[];
}

const NotificationsDropdown = ({
  notifications,
  markAsRead,
  refreshAll,
  animatedIds,
}: NotificationsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.seen).length;

  // ✅ Fermer le dropdown quand on clique à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickNotification = async (e: React.MouseEvent, n: Notification) => {
    e.stopPropagation();
    if (!n.seen) {
      await markAsRead(n);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition relative cursor-pointer"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <span className="text-sm font-medium">Toutes les notifications</span>
            <button onClick={refreshAll} className="p-1 rounded-full hover:bg-gray-100">
              <RefreshCw className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Aucune notification</p>
          ) : (
            <ul ref={listRef} className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between rounded-md hover:bg-gray-100
                                        ${!n.seen ? "font-medium bg-gray-50" : "opacity-70"}
                                        ${animatedIds.includes(n.id as number) ? "animate-fadeIn animate-highlight" : ""}`}
                  onClick={(e) => handleClickNotification(e, n)}
                >
                  <span className="flex items-center gap-2">
                    {n.priority === "urgent" && <AlertCircle className="h-4 w-4 text-red-500" />}
                    {n.message}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt as string).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
