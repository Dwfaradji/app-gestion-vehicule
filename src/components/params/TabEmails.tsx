"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Props {
    emails: string[];
    formEmail: string;
    setFormEmail: React.Dispatch<React.SetStateAction<string>>;
    showForm: boolean;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmAction: (action: { type: "valider-email" | "supprimer-email"; target: any }) => void;
}

export default function TabEmails({ emails, formEmail, setFormEmail, showForm, setShowForm, setConfirmAction }: Props) {
    const [error, setError] = useState("");

    const handleValidate = () => {
        if (!formEmail.trim()) {
            setError("L'email ne peut pas être vide.");
            return;
        }
        // Simple regex email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formEmail)) {
            setError("Email invalide.");
            return;
        }
        setError("");
        setConfirmAction({ type: "valider-email", target: formEmail.trim() });
        setFormEmail("");
        setShowForm(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Emails de notification</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 mb-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
                <Plus className="w-4 h-4" /> Ajouter un email
            </button>

            {showForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={formEmail}
                        onChange={e => setFormEmail(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleValidate}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Valider
                    </button>
                </div>
            )}

            <ul className="space-y-2">
                {emails.map((email, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                        {email}
                        <button
                            onClick={() => setConfirmAction({ type: "supprimer-email", target: email })}
                            className="text-red-600 hover:underline"
                        >
                            Supprimer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}