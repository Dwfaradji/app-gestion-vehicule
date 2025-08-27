"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useEmails } from "@/context/emailsContext";
import * as React from "react";
import {ConfirmAction} from "@/types/actions";

interface Props {
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabEmails({ setConfirmAction }: Props) {
    const {  emails, deleteEmail } = useEmails();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [formEmail, setFormEmail] = useState("");


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
        setConfirmAction({ type: "valider-email", target: formEmail.trim()})
        setFormEmail("");
        setShowForm(false);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Emails de notification</h2>

            {/* Bouton ajout */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 mb-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
                <Plus className="w-4 h-4" /> Ajouter un email
            </button>

            {/* Formulaire */}
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

            {/* Liste */}
            <ul className="space-y-2">
                {emails.map((email) => (
                    <li
                        key={email.id}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                    >
                        <span className="text-gray-700">{email.adresse}</span>
                        <button
                            onClick={() => deleteEmail(email.id)}
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