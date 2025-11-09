"use client";

import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthForm from "@/components/ui/AuthForm";
import { useState } from "react";
import { errorMap } from "@/utils/errorMap";

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSubmit = async (values: Record<string, string>) => {
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (res?.error) {
                const message = errorMap[res.error] || res.error || "Erreur inconnue";
                setError(message);
                return;
            }

            const session = await fetch("/api/auth/session").then((r) => r.json());

            if (session?.user?.mustChangePassword) router.push("/admin/update");
            else router.push("/dashboard");
        } catch {
            setError("Erreur inattendue lors de la connexion");
        }
    };

    return (
        <AuthForm
            title="Espace Admin"
            fields={[
                {
                    name: "email",
                    type: "email",
                    placeholder: "Email admin",
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
            backLink={[{ text: "Retour au site", href: "/dashboard" }]}
            errorMessage={error}
        />
    );
}