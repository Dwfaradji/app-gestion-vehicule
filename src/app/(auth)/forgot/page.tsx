"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setOk(true);
    } else {
      const j = await res.json().catch(() => ({ error: "Erreur" }));
      setErr(j.error || "Erreur inconnue.");
    }

    setLoading(false);
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
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Mot de passe oublié</h1>

        {err && (
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center mb-4">{err}</p>
        )}

        {ok ? (
          <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg text-center flex flex-col items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg font-semibold">
              Si votre email est enregistré, vous recevrez un lien sécurisé pour réinitialiser votre
              mot de passe.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform"
            >
              {loading ? "Envoi…" : "Demander la réinitialisation"}
            </motion.button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-sm underline text-blue-700 hover:text-blue-900"
          >
            Retour à la connexion
          </button>
        </div>
      </motion.div>
    </div>
  );
}
