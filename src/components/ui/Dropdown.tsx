"use client";
import React, { useState, ReactNode, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
    label: string | ReactNode;
    children: ReactNode;
    align?: "left" | "right" | "center";
}

export default function Dropdown({ label, children, align = "left" }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);

    // Ferme le dropdown quand on clique à l’extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Récupère la largeur du bouton
    useEffect(() => {
        if (ref.current) {
            const button = ref.current.querySelector("button");
            if (button) setButtonWidth(button.getBoundingClientRect().width);
        }
    }, [ref.current, label]);

    return (
        <div className="relative inline-block text-left" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border border-gray-300 bg-gray-50 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
            >
                {label}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div
                    style={{ width: buttonWidth }}
                    className={`absolute z-20 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-200 ${
                        align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"
                    }`}
                >
                    <div className="flex flex-col gap-1">
                        {React.Children.map(children, (child) => (
                            <div className="rounded-md px-3 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                                {child}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}