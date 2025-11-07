"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Briefcase, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function SetupAdminPage() {
    const [nom, setNom] = useState("");
    const [fonction, setFonction] = useState("Cadre");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setErr("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nom, fonction, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErr(data.error || "Erreur lors de la mise à jour des identifiants");
            } else {
                setSuccess("Vos identifiants ont été mis à jour avec succès !");
                setTimeout(() => router.push("/dashboard"), 1500);
            }
        } catch (error) {
            if (error instanceof Error) setErr(error.message);
            else setErr("Erreur inattendue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 to-blue-700">
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
                className="relative bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full"
            >
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                    Configuration du compte Admin
                </h1>

                {err && (
                    <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center mb-4">{err}</p>
                )}
                {success && (
                    <p className="text-sm text-green-600 bg-green-100 p-2 rounded-md text-center mb-4">
                        {success}
                    </p>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Nom */}
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
                            required
                        />
                    </div>

                    {/* Fonction */}
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <select
                            value={fonction}
                            onChange={(e) => setFonction(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition bg-white"
                        >
                            <option value="Cadre">Cadre</option>
                            <option value="Employé">Employé</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
                            required
                        />
                    </div>

                    {/* Mot de passe */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Confirmer mot de passe */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmer mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                        className="w-full"
                        loading={loading}
                    >
                        {loading ? "Mise à jour…" : "Enregistrer"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}