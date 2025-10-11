"use client";

import React from "react";
import { motion } from "framer-motion";

export interface Column<T> {
  /** Clé correspondante à une propriété de l'objet T (optionnelle si colonne custom) */
  key?: string;
  /** Label affiché dans l'en-tête */
  label: string;
  /** Fonction pour customiser le rendu de la cellule */
  render?: (item: T) => React.ReactNode;
  /** Alignement horizontal */
  align?: "left" | "center" | "right";
  /** Largeur de la colonne */
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
              <td colSpan={columns.length} className="py-6 text-center text-gray-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <motion.tr
                key={idx}
                onClick={() => onRowClick?.(item)}
                className={`${onRowClick ? "cursor-pointer hover:bg-blue-50 transition" : ""}`}
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
                      : col.key
                        ? String(item[col.key as keyof T] ?? "-")
                        : "-"}
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
