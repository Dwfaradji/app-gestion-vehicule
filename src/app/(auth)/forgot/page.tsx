"use client";

import { useState } from "react";

export default function ForgotPage() {
    const [email, setEmail] = useState("");
    const [ok, setOk] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        const res = await fetch("/api/auth/forgot", {
            method: "POST",
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            setOk(true);
        } else {
            const j = await res.json().catch(() => ({ error: "Erreur" }));
            setErr(j.error || "Erreur");
        }
    };

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border">
                <h1 className="text-xl font-semibold">Mot de passe oublié</h1>
                {err && <p className="text-sm text-red-600">{err}</p>}
                {ok ? (
                    <p className="text-green-700 text-sm">
                        Si votre email est enregistré, vous recevrez un lien sécurisé pour réinitialiser votre mot de passe.
                    </p>
                ) : (
                    <>
                        <input
                            type="email"
                            placeholder="Votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                        />
                        <button className="w-full bg-blue-600 text-white rounded-md px-3 py-2">
                            Demander la réinitialisation
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}