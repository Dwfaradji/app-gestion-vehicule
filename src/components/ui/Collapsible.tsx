"use client";
import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
    title: string | ReactNode;
    defaultOpen?: boolean;
    children: ReactNode;
}

export default function Collapsible({
                                        title,
                                        defaultOpen = true,
                                        children,
                                    }: CollapsibleProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-xl bg-gray-50 shadow-sm overflow-hidden transition-all duration-300">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold hover:bg-gray-100 transition"
            >
                <span>{title}</span>
                <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            <div
                className={`transition-all duration-300 ${
                    open ? "max-h-[1000px] opacity-100 p-4" : "max-h-0 opacity-0 p-0"
                }`}
            >
                {open && children}
            </div>
        </div>
    );
}