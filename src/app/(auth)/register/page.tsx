"use client";

import { User, Briefcase, Lock } from "lucide-react";
import AuthForm from "@/components/ui/AuthForm";
import {useState} from "react";

export default function RegisterPage() {
    const [successMsg, setSuccessMsg] = useState<string>();
    const [, setErrorMsg] = useState<string>();

  const handleRegister = async (values: Record<string, string>) => {

    if (values.password !== values.confirmPassword)
      throw new Error("Les mots de passe ne correspondent pas");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.nom,
        fonction: values.fonction,
        email: values.email,
        password: values.password,
        status: "PENDING",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      const error= new Error(data.error || "Erreur lors de la création du compte");
      setErrorMsg(String(error))
    }
setSuccessMsg(String("Votre compte a été créé et est en attente de validation par l'administrateur."));

  };

  return (
    <AuthForm
      title="Créer un compte"
      submitText="Créer mon compte"
      fields={[
        {
          name: "nom",
          type: "text",
          placeholder: "Nom",
          icon: <User className="text-gray-400 h-5 w-5" />,
        },
        {
          name: "fonction",
          type: "select",
          options: ["Cadre", "Employé"],
          icon: <Briefcase className="text-gray-400 h-5 w-5" />,
        },
        {
          name: "email",
          type: "email",
          placeholder: "Email",
          icon: <User className="text-gray-400 h-5 w-5" />,
        },
        {
          name: "password",
          type: "password",
          placeholder: "Mot de passe",
          icon: <Lock className="text-gray-400 h-5 w-5" />,
        },
        {
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirmer le mot de passe",
          icon: <Lock className="text-gray-400 h-5 w-5" />,
        },
      ]}
      onSubmitAction={handleRegister}
      successMessage={successMsg}
      backLink={[
          { text: "Retour à la connexion", href: "/login" },
      ]}
    />
  );
}
