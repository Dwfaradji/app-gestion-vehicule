"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);

        if (password !== confirmPassword) {
            setErr("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        // Ici tu peux appeler ton endpoint pour créer l'utilisateur
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        setLoading(false);
        if (res?.error) setErr(res.error);
        else router.push("/vehicules");
    };

    return (
        <div className="min-h-screen flex">
            {/* Desktop */}
            <div className="relative hidden md:flex flex-1 items-center justify-center bg-gradient-to-tr from-blue-500 to-blue-700 overflow-hidden">
                <img
                    src="/login-illustration.svg"
                    alt="Illustration"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                        Créer un compte
                    </h1>

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

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
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

                        {/* Confirm Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmer le mot de passe"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>

                            {confirmPassword && confirmPassword === password && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute right-3 top-2.5 text-green-500"
                                >
                                    ✅
                                </motion.div>
                            )}
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform"
                        >
                            {loading ? "Création…" : "Créer mon compte"}
                        </motion.button>
                    </form>

                    <div className="flex justify-between text-sm text-blue-600 mt-4">
                        <Link href="/login" className="hover:underline">
                            Déjà un compte ?
                        </Link>
                        <Link href="/forgot" className="hover:underline">
                            Mot de passe oublié
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Mobile */}
            <div className="flex flex-1 items-center justify-center p-8 md:hidden">
                <motion.form
                    onSubmit={onSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 space-y-6"
                >
                    <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
                        Créer un compte
                    </h1>

                    {err && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center mb-4"
                        >
                            {err}
                        </motion.p>
                    )}

                    {/* Champs identiques pour mobile */}
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

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
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

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>

                        {confirmPassword && confirmPassword === password && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute right-3 top-2.5 text-green-500"
                            >
                                ✅
                            </motion.div>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform"
                    >
                        {loading ? "Création…" : "Créer mon compte"}
                    </motion.button>

                    <div className="flex justify-between text-sm text-blue-600 mt-4">
                        <Link href="/login" className="hover:underline">
                            Déjà un compte ?
                        </Link>
                        <Link href="/forgot" className="hover:underline">
                            Mot de passe oublié
                        </Link>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}