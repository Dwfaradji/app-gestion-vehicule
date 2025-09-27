"use client";

interface ActionBarProps {
    setAttribuerOpen: (open: boolean) => void;
    handleRefresh: () => void;
}

import { RefreshCw } from "lucide-react";

export default function ActionBar({ setAttribuerOpen, handleRefresh }: ActionBarProps) {
    return (
        <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-800 flex-1">🚘 Suivi des véhicules & trajets</h1>
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setAttribuerOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md flex items-center gap-1 transition transform hover:scale-105"
                >
                    + Attribuer un véhicule
                </button>
                <button
                    onClick={handleRefresh}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-1 transition transform hover:scale-105"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>
        </div>
    );
}