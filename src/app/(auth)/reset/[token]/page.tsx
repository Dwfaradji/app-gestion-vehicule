"use client";

import { useParams, useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import AuthForm from "@/components/ui/AuthForm";

export default function ResetPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token ?? "";

  const handleReset = async (values: Record<string, string>) => {
    if (values.password !== values.confirmPassword)
      throw new Error("Les mots de passe ne correspondent pas");

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: values.password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Erreur serveur");
    }

    setTimeout(() => router.push("/login"), 2500);
  };

  return (
    <AuthForm
      title="Réinitialiser le mot de passe"
      submitText="Mettre à jour le mot de passe"
      fields={[
        {
          name: "password",
          type: "password",
          placeholder: "Nouveau mot de passe",
          icon: <Lock className="text-gray-400 h-5 w-5" />,
        },
        {
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirmer le mot de passe",
          icon: <Lock className="text-gray-400 h-5 w-5" />,
        },
      ]}
      onSubmitAction={handleReset}
      backLink={{ text: "Retour à la connexion", href: "/login" }}
    />
  );
}
