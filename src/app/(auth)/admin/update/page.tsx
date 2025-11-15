"use client";

import { User, Briefcase, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/ui/AuthForm";
// import { useAdmin } from "@/hooks/useAdmin";
import { signIn } from "next-auth/react";

export default function SetupAdminPage() {
  const router = useRouter();
  // const { loading } = useAdmin();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSetup = async (values: Record<string, string>) => {
    if (values.password !== values.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }
    console.log(values.id, "id admin");
    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: values.id,
          nom: values.nom,
          fonction: values.fonction,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Vous avez déjà configuré votre compte") {
          router.replace("/dashboard");
          return;
        }
        new Error(data.error || "Erreur lors de la mise à jour");
      }

      // ✅ Regenerate le token JWT avec les nouvelles infos
      await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      // ✅ Redirige vers le dashboard après la configuration
      router.replace("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message || "Erreur lors de la mise à jour");
      }
    }
  };

  // if (loading)
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <p className="text-gray-500 text-lg animate-pulse">Vérification de l’accès...</p>
  //     </div>
  //   );

  return (
    <AuthForm
      title="Configuration du compte Admin"
      submitText="Enregistrer"
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
      onSubmitAction={handleSetup}
      errorMessage={errorMessage || ""}
      backLink={{ text: "Retour au dashboard", href: "/dashboard" }}
    />
  );
}
