// lib/auth-protect.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

/**
 * Vérifie l'accès d'une page selon le rôle attendu.
 * @param allowedRoles - Liste des rôles autorisés (ex: ["ADMIN"])
 * @param redirectPath - Chemin de redirection si non autorisé (par défaut "/login")
 */
export async function protectRoute(
    allowedRoles: string[] = [],
    redirectPath = "/login"
) {
    const session = await getServerSession(authOptions);

    // Si non connecté → redirection vers login
    if (!session) {
        redirect(redirectPath);
    }

    // Si connecté mais rôle non autorisé → redirection
    if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role!)) {
        redirect("/dashboard"); // Ou autre page par défaut
    }

    return session;
}