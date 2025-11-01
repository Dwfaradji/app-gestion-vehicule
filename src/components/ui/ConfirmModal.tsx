"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface ConfirmModalProps {
  /** Affiche ou cache la modale */
  open: boolean;
  /** Ferme la modale */
  onClose: () => void;
  /** Fonction à exécuter lors de la confirmation */
  onConfirm: () => void;
  /** Titre de la modale */
  title?: string;
  /** Message principal */
  message: string;
  /** Texte du bouton de confirmation */
  confirmLabel?: string;
  /** Texte du bouton d'annulation */
  cancelLabel?: string;
  /** Style danger (rouge) ou neutre */
  variant?: "danger" | "default";
}

/**
 * Modale de confirmation réutilisable.
 */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmer l'action",
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "default",
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                {cancelLabel}
              </button>

              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  variant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
