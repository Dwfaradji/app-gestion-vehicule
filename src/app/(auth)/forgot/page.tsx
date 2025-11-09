"use client";

import { Mail } from "lucide-react";
import AuthForm from "@/components/ui/AuthForm";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ForgotPage() {
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg] = useState<string>("");

  const handleForgot = async (values: Record<string, string>) => {
    const res = await api("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: values.email }),
    });

    if (res) {
      setSuccessMsg(
        "Si votre email est enregistré, vous recevrez un lien sécurisé pour réinitialiser votre mot de passe.",
      );
    }
  };

  return (
    <AuthForm
      title="Mot de passe oublié"
      submitText="Demander la réinitialisation"
      fields={[
        {
          name: "email",
          type: "email",
          placeholder: "Votre email",
          icon: <Mail className="text-gray-400 h-5 w-5" />,
        },
      ]}
      onSubmitAction={handleForgot}
      successMessage={successMsg}
      backLink={{ text: "Retour à la connexion", href: "/login" }}
      errorMessage={errorMsg}
    />
  );
}
