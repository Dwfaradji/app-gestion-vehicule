"use client";

import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useEmails } from "@/context/emailsContext";
import FormField from "@/components/ui/FormField";
import confirmAndRun from "@/helpers/helperConfirmAndRun";
import getConfirmMessage from "@/helpers/helperConfirm";
import { Email } from "@/types/entretien";
import { useConfirm } from "@/hooks/useConfirm";

export default function TabEmails() {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const { emails, addEmail, deleteEmail } = useEmails();
  const { confirm, ConfirmContainer } = useConfirm();

  const handleValidate = async () => {
    if (!formEmail.trim()) {
      setError("L'email ne peut pas être vide.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      setError("Email invalide.");
      return;
    }

    setError("");

    // ✅ On envoie juste l'adresse pour ConfirmAction
    await confirmAndRun(
      confirm,
      {
        title: "Valider le Véhicule",
        message: getConfirmMessage({
          type: "valider-email",
          target: { adresse: formEmail.trim() },
        }),
        variant: "default",
      },
      () => addEmail(formEmail),
    );

    setFormEmail("");
    setShowForm(false);
  };

  const handleDeleteMail = async (email: Email) => {
    await confirmAndRun(
      confirm,
      {
        title: "Supprimer l'email",
        message: getConfirmMessage({ type: "supprimer-email", target: { adresse: email.adresse } }),
        variant: "danger",
      },
      () => deleteEmail(email.id),
    );
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Emails de notification</h2>
      {ConfirmContainer}
      {/* Bouton ajout */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 mb-8 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        <Plus className="w-4 h-4" /> Ajouter un email
      </button>

      {/* Formulaire */}
      {showForm && (
        <div className="mb-4 p-6 bg-gray-50 dark:bg-gray-900/40 rounded-2xl shadow-sm space-y-6 border border-gray-200 dark:border-gray-700">
          <FormField
            label="Adresse email"
            type="text"
            value={formEmail}
            onChange={setFormEmail}
            valid={!!formEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)}
            error={
              formEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)
                ? "Adresse email invalide"
                : error
            }
          />

          <div className="flex justify-end">
            <button
              onClick={handleValidate}
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition font-medium"
            >
              Valider
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <ul className="space-y-2">
        {emails.map((email) => (
          <li
            key={email.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
          >
            <span className="text-gray-700">{email.adresse}</span>
            <button
              onClick={() => handleDeleteMail(email)}
              className="p-1 rounded-full hover:bg-red-100"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
