"use client";

import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthForm from "@/components/ui/AuthForm";
import { errorMap } from "@/utils/errorMap";

import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      console.log(res);

      if (res?.error) {
        const message = errorMap[res.error] || res.error || "Erreur inconnue";
        setErrorMsg(message);
        return;
      }

      // Recharge la session pour que le middleware redirige automatiquement
      router.refresh();
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error("Erreur inattendue lors de la connexion");
    }
  };

  return (
    <AuthForm
      title="Connexion"
      fields={[
        {
          name: "email",
          type: "email",
          placeholder: "Votre email",
          icon: <User className="h-5 w-5 text-gray-400" />,
        },
        {
          name: "password",
          type: "password",
          placeholder: "Mot de passe",
          icon: <Lock className="h-5 w-5 text-gray-400" />,
        },
      ]}
      submitText="Se connecter"
      onSubmitAction={handleSubmit}
      backLink={[
        { text: "Créer un compte", href: "/register" },
        { text: "Mot de passe oublié ?", href: "/forgot" },
      ]}
      errorMessage={errorMsg}
    />
  );
}
