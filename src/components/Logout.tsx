"use client";

import { signOut, useSession } from "next-auth/react";

export default function Logout() {
    const { data: session } = useSession();

    if (!session) return null; // Pas de bouton si non connecté

    return (
        <header className="w-full bg-gray-100 p-4 flex justify-start">
      <span className="mr-4 text-sm text-gray-700">

      </span>
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
                Déconnexion
            </button>
            Bonjour {session.user?.email}
        </header>
    );
}