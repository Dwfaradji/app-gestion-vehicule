"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

export type Action<T> = {
  icon: keyof typeof LucideIcons;
  color?: "green" | "red" | "blue" | "gray";
  onClick: (row: T) => void;
  tooltip?: string;
  show?: boolean;
};

interface ActionButtonsProps<T> {
  row: T;
  buttons?: Action<T>[];
  className?: string;
}

export default function ActionButtons<T>({
  row,
  buttons = [],
  className = "",
}: ActionButtonsProps<T>) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {buttons.map((btn, i) => {
        if (btn.show === false) return null;

        // ✅ Cast explicite vers un composant React
        const Icon = LucideIcons[btn.icon] as React.ComponentType<LucideProps> | undefined;

        const colorClasses: Record<NonNullable<Action<T>["color"]>, string> = {
          green: "text-green-600 hover:bg-green-100",
          red: "text-red-600 hover:bg-red-100",
          blue: "text-blue-600 hover:bg-blue-100",
          gray: "text-gray-500 hover:bg-gray-100",
        };

        return (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              btn.onClick(row);
            }}
            className={`p-2 rounded-full ${colorClasses[btn.color ?? "gray"]}`}
            title={btn.tooltip}
          >
            {Icon && <Icon className="w-4 h-4" />}
          </button>
        );
      })}
    </div>
  );
}
