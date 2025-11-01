"use client";

import React, { useState, useMemo } from "react";
import { useUtilisateurs } from "@/context/utilisateursContext";
import FormField from "@/components/ui/FormField";
import confirmAndRun from "@/helpers/helperConfirmAndRun";
import getConfirmMessage from "@/helpers/helperConfirm";
import { useConfirm } from "@/hooks/useConfirm";

export default function TabPassword() {
  const { utilisateurs, updatePassword } = useUtilisateurs();
  console.log(utilisateurs, "utilisateurs");

  // TODO a remplacer par un utilisateur car ne fais que récupérere le 1er utilisateur
  const userId = utilisateurs[0]?.id;

  const [formPassword, setFormPassword] = useState({
    actuel: "",
    nouveau: "",
    confirmer: "",
  });
  const [error, setError] = useState<string | null>(null);

  const validationMessage = useMemo(() => {
    if (!formPassword.actuel || !formPassword.nouveau || !formPassword.confirmer)
      return "Tous les champs sont obligatoires.";
    if (formPassword.nouveau.length < 8)
      return "Le mot de passe doit contenir au moins 8 caractères.";
    if (formPassword.nouveau === formPassword.actuel)
      return "Le nouveau mot de passe doit être différent de l’actuel.";
    if (formPassword.nouveau !== formPassword.confirmer)
      return "La confirmation ne correspond pas.";
    return null;
  }, [formPassword]);

  const { confirm, ConfirmContainer } = useConfirm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return setError("Utilisateur non trouvé");
    if (validationMessage) return setError(validationMessage);

    setError(null);

    await confirmAndRun(
      confirm,
      {
        title: "Modifier le mot de passe",
        message: getConfirmMessage({ type: "modifier-password" }),
        variant: "default",
      },
      () =>
        updatePassword({ id: userId, actuel: formPassword.actuel, nouveau: formPassword.nouveau }),
    );

    setFormPassword({ actuel: "", nouveau: "", confirmer: "" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Modifier le mot de passe admin</h2>
      <div className="shadow-sm rounded-2xl p-6 max-w-xl mx-auto">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <FormField
            label="Mot de passe actuel"
            type="password"
            value={formPassword.actuel}
            onChange={(val) => setFormPassword((p) => ({ ...p, actuel: val }))}
          />

          <FormField
            label="Nouveau mot de passe"
            type="password"
            value={formPassword.nouveau}
            onChange={(val) => setFormPassword((p) => ({ ...p, nouveau: val }))}
            error={
              formPassword.nouveau.length > 0 && formPassword.nouveau.length < 8
                ? "Minimum 8 caractères"
                : undefined
            }
          />

          <FormField
            label="Confirmer le mot de passe"
            type="password"
            value={formPassword.confirmer}
            onChange={(val) => setFormPassword((p) => ({ ...p, confirmer: val }))}
            error={
              formPassword.confirmer && formPassword.nouveau !== formPassword.confirmer
                ? "Les mots de passe ne correspondent pas"
                : undefined
            }
          />

          <button
            type="submit"
            disabled={!!validationMessage}
            className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-xl shadow hover:brightness-110 transition"
          >
            Valider
          </button>

          <p className="text-xs text-gray-500 mt-1">
            Le mot de passe doit contenir au moins 8 caractères.
          </p>
        </form>
      </div>
      {ConfirmContainer}
    </div>
  );
}
