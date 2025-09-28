"use client";

import * as React from "react";
import { useUtilisateurs } from "@/context/utilisateursContext";
import { ConfirmAction } from "@/types/actions";
import {InputPassword} from "@/components/ui/InputPassword";

interface Props {
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabPassword({ setConfirmAction }: Props) {
    const { utilisateurs } = useUtilisateurs();
    const userId = utilisateurs[0]?.id;

    const [formPassword, setFormPassword] = React.useState({
        actuel: "",
        nouveau: "",
        confirmer: "",
    });
    const [error, setError] = React.useState<string | null>(null);

    const validationMessage = React.useMemo(() => {
        if (!formPassword.actuel || !formPassword.nouveau || !formPassword.confirmer)
            return "Tous les champs sont obligatoires.";
        if (formPassword.nouveau.length < 8) return "Le nouveau mot de passe doit contenir au moins 8 caractères.";
        if (formPassword.nouveau === formPassword.actuel) return "Le nouveau mot de passe doit être différent de l'actuel.";
        if (formPassword.nouveau !== formPassword.confirmer) return "La confirmation ne correspond pas.";
        return null;
    }, [formPassword]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return setError("Utilisateur non trouvé");
        if (validationMessage) return setError(validationMessage);

        setError(null);
        setConfirmAction({
            type: "modifier-password",
            target: { actuel: formPassword.actuel, nouveau: formPassword.nouveau },
        });
        setFormPassword({ actuel: "", nouveau: "", confirmer: "" });
    };

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Modifier le mot de passe admin</h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {error && (
                    <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <InputPassword
                    id="password-actuel"
                    label="Mot de passe actuel"
                    value={formPassword.actuel}
                    onChange={(val) => setFormPassword((p) => ({ ...p, actuel: val }))}
                />
                <InputPassword
                    id="password-nouveau"
                    label="Nouveau mot de passe"
                    value={formPassword.nouveau}
                    onChange={(val) => setFormPassword((p) => ({ ...p, nouveau: val }))}
                />
                <InputPassword
                    id="password-confirmer"
                    label="Confirmer le mot de passe"
                    value={formPassword.confirmer}
                    onChange={(val) => setFormPassword((p) => ({ ...p, confirmer: val }))}
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
    );
}