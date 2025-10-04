"use client";

import React from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

type LoaderProps = {
    isLoading?: boolean;       // ✅ contrôle le loader
    message?: string;
    skeleton?: "card" | "list" | "text" | "none";
    fullscreen?: boolean;
};

export default function Loader({
                                   isLoading = true,
                                   message = "Chargement...",
                                   skeleton = "none",
                                   fullscreen = false,
                               }: LoaderProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={clsx(
                        fullscreen ? "fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex items-center justify-center" : "",
                        "transition-all"
                    )}
                >
                    <div
                        className={clsx(
                            "flex flex-col items-center justify-center gap-6",
                            fullscreen ? "" : "min-h-[200px]"
                        )}
                    >
                        {/* Spinner */}
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

                        {/* Message */}
                        <p className="text-gray-600 dark:text-gray-300 font-medium">{message}</p>

                        {/* Skeleton variants */}
                        {skeleton === "card" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                                {[...Array(2)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="p-6 rounded-xl shadow bg-gray-200 dark:bg-gray-800 animate-pulse"
                                    >
                                        <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
                                        <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                                        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {skeleton === "list" && (
                            <ul className="w-full max-w-lg space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <li
                                        key={i}
                                        className="h-10 rounded bg-gray-200 dark:bg-gray-800 animate-pulse"
                                    />
                                ))}
                            </ul>
                        )}

                        {skeleton === "text" && (
                            <div className="space-y-2 w-full max-w-md">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}