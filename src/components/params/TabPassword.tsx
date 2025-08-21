"use client";
import { useState } from "react";

interface Props {
    formPassword: { actuel: string; nouveau: string; confirmer: string };
    setFormPassword: React.Dispatch<React.SetStateAction<{ actuel: string; nouveau: string; confirmer: string }>>;
    setConfirmAction: (action: { type: "modifier-password"; target: any }) => void;
}

export default function TabPassword({ formPassword, setFormPassword, setConfirmAction }: Props) {
    const [error, setError] = useState("");

    const handleValidate = () => {
        if (!formPassword.actuel.trim() || !formPassword.nouveau.trim() || !formPassword.confirmer.trim()) {
            setError("Tous les champs sont obligatoires.");
            return;
        }

        if (formPassword.nouveau !== formPassword.confirmer) {
            setError("La confirmation ne correspond pas au nouveau mot de passe.");
            return;
        }

        setError("");
        setConfirmAction({ type: "modifier-password", target: formPassword });
        setFormPassword({ actuel: "", nouveau: "", confirmer: "" });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Modifier le mot de passe admin</h2>
            <div className="flex flex-col gap-3 w-1/2">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <input
                    type="password"
                    placeholder="Mot de passe actuel"
                    value={formPassword.actuel}
                    onChange={e => setFormPassword({ ...formPassword, actuel: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={formPassword.nouveau}
                    onChange={e => setFormPassword({ ...formPassword, nouveau: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Confirmer mot de passe"
                    value={formPassword.confirmer}
                    onChange={e => setFormPassword({ ...formPassword, confirmer: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleValidate}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Valider
                </button>
            </div>
        </div>
    );
}