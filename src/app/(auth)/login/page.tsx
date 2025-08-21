"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        setLoading(false);
        if (res?.error) {
            setErr(res.error);
        } else {
            router.push("/vehicules"); // redirection après connexion
        }
    };

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl border">
                <h1 className="text-xl font-semibold">Connexion</h1>
                {err && <p className="text-sm text-red-600">{err}</p>}
                <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                />
                <input
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Mot de passe"
                    type="password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                />
                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-md px-3 py-2"
                >
                    {loading ? "…" : "Se connecter"}
                </button>
                <div className="text-sm flex justify-between">
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Créer un compte
                    </Link>
                    <Link href="/forgot" className="text-blue-600 hover:underline">
                        Mot de passe oublié
                    </Link>
                </div>
            </form>
        </div>
    );
}