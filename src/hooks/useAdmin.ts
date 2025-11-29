"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Session } from "next-auth";

export function useAdmin() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null); // ✅ ici
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // 🔄 On récupère la session la plus à jour
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        const session = data || null;

        if (!session?.user) {
          router.replace("/dashboard");
          return;
        }

        // ❌ Si pas admin → redirection login normal
        if (session.user.role !== "ADMIN") {
          router.replace("/login");
          return;
        }

        // 🔐 Si l’admin doit changer son mot de passe
        if (session.user.mustChangePassword === true) {
          // ✅ Il peut accéder UNIQUEMENT à /admin/update
          if (pathname !== "/admin/update") {
            router.replace("/admin/update");
            return;
          }
        } else {
          // 🚫 S'il a déjà changé, il ne doit PAS accéder à /admin/update
          if (pathname === "/admin/update") {
            router.replace("/dashboard");
            return;
          }
        }

        setSession(session);
        setLoading(false);
      } catch (err) {
        console.error("Erreur vérification admin:", err);
        router.replace("/admin/");
      }
    };

    verifyAdmin();
  }, [router, pathname]);

  return { session, loading, isAdmin: session?.user?.role === "ADMIN" };
}
