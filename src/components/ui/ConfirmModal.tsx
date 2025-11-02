"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

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
    <Modal isOpen={open} onClose={onClose} title={title} width="w-full max-w-md">
      <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
        >
          {cancelLabel}
        </Button>

        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant={variant === "danger" ? "danger" : "primary"}
          isActive={variant === "danger"}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
