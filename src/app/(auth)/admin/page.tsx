"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
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
            return;
        }

        // ✅ Vérifier le flag mustChangePassword via la session
        const session = await fetch("/api/auth/session").then((r) => r.json());

        if (session?.user?.mustChangePassword) {
            router.push("/admin/update"); // première connexion
        } else {
            router.push("/dashboard");
        }
    };
    return (
        <div className="min-h-screen flex">
            {/* Illustration */}
            <div className="relative hidden md:flex flex-1 items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-700 overflow-hidden">
                <Image
                    src="/backgroundCars.jpg"
                    width={1920}
                    height={1080}
                    quality={100}
                    priority
                    alt="Illustration connexion"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Espace Admin</h1>

                    {err && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center mb-4"
                        >
                            {err}
                        </motion.p>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                placeholder="Email admin"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                required
                            />
                        </div>

                        <Button className="w-full" variant="primary" type="submit" disabled={loading}>
                            {loading ? "Connexion…" : "Se connecter"}
                        </Button>
                    </form>

                    <div className="text-center mt-4">
                        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
                            Retour au site
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}