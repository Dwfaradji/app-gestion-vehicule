"use client";
import React from "react";

type LoaderProps = {
    message?: string;
    skeleton?: "card" | "list" | "text" | "none";
};

export default function Loader({ message = "Chargement...", skeleton = "none" }: LoaderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-6">
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

            {/* Message */}
            <p className="text-gray-600 font-medium">{message}</p>

            {/* Skeletons */}
            {skeleton === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="p-6 rounded-xl shadow bg-gray-200 dark:bg-gray-700 animate-pulse">
                            <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-4" />
                            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                            <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
                        </div>
                    ))}
                </div>
            )}

            {skeleton === "list" && (
                <ul className="w-full max-w-lg space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <li key={i} className="h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    ))}
                </ul>
            )}

            {skeleton === "text" && (
                <div className="space-y-2 w-full max-w-md">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                </div>
            )}
        </div>
    );
}