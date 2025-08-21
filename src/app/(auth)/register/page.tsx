"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [ok, setOk] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        const res = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password, name }),
        });
        if (res.ok) setOk(true);
        else {
            const j = await res.json().catch(()=>({error:"Erreur"}));
            setErr(j.error || "Erreur");
        }
    };

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border">
                <h1 className="text-xl font-semibold">Inscription</h1>
                {ok ? (
                    <p className="text-green-700 text-sm">
                        Compte créé. Il doit être <b>validé par un administrateur</b> avant de pouvoir vous connecter.
                    </p>
                ) : (
                    <>
                        {err && <p className="text-sm text-red-600">{err}</p>}
                        <input className="w-full border rounded-md px-3 py-2" placeholder="Nom (optionnel)" value={name} onChange={e=>setName(e.target.value)} />
                        <input className="w-full border rounded-md px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
                        <input className="w-full border rounded-md px-3 py-2" placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                        <button className="w-full bg-blue-600 text-white rounded-md px-3 py-2">Créer le compte</button>
                        <div className="text-sm">
                            <Link href="/login" className="text-blue-600 hover:underline">Déjà un compte ? Connexion</Link>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}