"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

export type Action<T = any> = {
    icon: keyof typeof LucideIcons;
    color?: "green" | "red" | "blue" | "gray";
    onClick: (row: T) => void;   // ici tu vas appeler setConfirmAction
    tooltip?: string;
    show?: boolean;               // optionnel pour masquer certains boutons
};

interface ActionButtonsProps<T = any> {
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
                if (!btn.show && btn.show !== undefined) return null;

                const Icon = LucideIcons[btn.icon];
                const colorClasses = {
                    green: "text-green-600 hover:bg-green-100",
                    red: "text-red-600 hover:bg-red-100",
                    blue: "text-blue-600 hover:bg-blue-100",
                    gray: "text-gray-500 hover:bg-gray-100",
                };

                return (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); btn.onClick(row); }}
                        className={`p-2 rounded-full ${colorClasses[btn.color || "gray"]}`}
                        title={btn.tooltip}
                    >
                        {Icon && <Icon className="w-4 h-4" />}
                    </button>
                );
            })}
        </div>
    );
}