"use client";

import React from "react";
import { motion } from "framer-motion";

interface Column<T> {
    /** Clé correspondant à une propriété de l'objet */
    key: keyof T | string;
    /** Nom de la colonne affichée */
    label: string;
    /** Fonction de rendu optionnelle pour un contenu personnalisé */
    render?: (item: T) => React.ReactNode;
    /** Alignement du texte */
    align?: "left" | "center" | "right";
    /** Largeur de colonne */
    width?: string;
}

interface TableProps<T> {
    /** Données du tableau */
    data: T[];
    /** Colonnes à afficher */
    columns: Column<T>[];
    /** Action au clic sur une ligne */
    onRowClick?: (item: T) => void;
    /** Message lorsqu’il n’y a aucune donnée */
    emptyMessage?: string;
    /** Si tu veux rendre la table responsive avec scroll */
    responsive?: boolean;
}

export default function Table<T>({
                                     data,
                                     columns,
                                     onRowClick,
                                     emptyMessage = "Aucune donnée disponible",
                                     responsive = true,
                                 }: TableProps<T>) {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden ${
                responsive ? "overflow-x-auto" : ""
            }`}
        >
            <table className="min-w-full divide-y divide-gray-200">
                {/* En-têtes */}
                <thead className="bg-gray-50">
                <tr>
                    {columns.map((col) => (
                        <th
                            key={String(col.key)}
                            className={`px-4 py-3 text-xs font-semibold uppercase text-gray-500 tracking-wider text-${col.align || "left"}`}
                            style={{ width: col.width }}
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>

                {/* Corps */}
                <tbody className="divide-y divide-gray-100">
                {data.length === 0 ? (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="py-6 text-center text-gray-400 text-sm"
                        >
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    data.map((item, idx) => (
                        <motion.tr
                            key={idx}
                            onClick={() => onRowClick?.(item)}
                            className={`${
                                onRowClick
                                    ? "cursor-pointer hover:bg-blue-50 transition"
                                    : ""
                            }`}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className={`px-4 py-3 text-sm text-gray-700 text-${col.align || "left"}`}
                                >
                                    {col.render
                                        ? col.render(item)
                                        : String((item as any)[col.key] ?? "-")}
                                </td>
                            ))}
                        </motion.tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}