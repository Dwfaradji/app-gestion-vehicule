"use client";
import { useState, ReactNode, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
  title: string | ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  length?: number;
}

export default function Collapsible({
  title,
  defaultOpen = true,
  children,
  length,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  // Si length === 0, ouvrir automatiquement
  useEffect(() => {
    if (length === 0) setOpen(true);
  }, [length]);

  const isDisabled = length === 0;

  return (
    <div className="border border-gray-200 rounded-xl bg-gray-50 shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => !isDisabled && setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left font-semibold transition
          ${isDisabled ? "cursor-not-allowed text-gray-400 bg-gray-100" : "hover:bg-gray-100"}`}
      >
        <span>{title}</span>
        {!isDisabled && (
          <ChevronDown
            className={`w-5 h-5 transform transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      <div
        className={`transition-all duration-300 ${
          open ? "max-h-[1000px] opacity-100 p-4" : "max-h-0 opacity-0 p-0"
        }`}
      >
        {isDisabled ? <div className="text-gray-500 italic">Pas de véhicules</div> : children}
      </div>
    </div>
  );
}
