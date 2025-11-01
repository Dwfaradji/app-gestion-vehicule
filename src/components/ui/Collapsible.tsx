"use client";

import { useState, ReactNode, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
  title: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean; // ✅ ouverture par défaut
  open?: boolean; // ✅ contrôle depuis parent
  onToggle?: (isOpen: boolean) => void; // callback si toggle
  length?: number;
  icon?: ReactNode;
  disabled?: boolean;
}

export default function Collapsible({
  title,
  children,
  defaultOpen = true, // 👈 par défaut fermé
  open: controlledOpen,
  onToggle,
  length,
  icon,
  disabled = false,
}: CollapsibleProps) {
  // état interne seulement si pas contrôlé par le parent
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // ouverture automatique si pas de contenu
  useEffect(() => {
    if (length === 0) {
      // Mise à jour de l'état après le rendu initial
      const id = setTimeout(() => setInternalOpen(true), 0);
      return () => clearTimeout(id);
    }
  }, [length]);

  // vrai état : parent contrôle si fourni, sinon interne
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = () => {
    if (disabled || length === 0) return;
    const newState = !isOpen;
    if (controlledOpen === undefined) setInternalOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-gray-50 shadow-sm overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={toggle}
        className={`w-full flex items-center justify-between px-4 py-3 text-left font-semibold transition
          ${disabled || length === 0 ? "cursor-not-allowed text-gray-400 bg-gray-100" : "hover:bg-gray-100"}`}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="w-5 h-5">{icon}</span>}
          <span>{title}</span>
        </div>

        {!disabled && length !== 0 && (
          <ChevronDown
            className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      <div
        className={`transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100 p-4" : "max-h-0 opacity-0 p-0"}`}
      >
        {length === 0 ? <div className="text-gray-500 italic">Aucun élément</div> : children}
      </div>
    </div>
  );
}
