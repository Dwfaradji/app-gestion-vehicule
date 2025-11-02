"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) return null;

  return (
    <div className="relative ">
      {/* Bouton principal */}
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-gray-200 hover:shadow-lg hover:ring-2 hover:ring-blue-400 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
      >
        <span className="font-semibold text-gray-800">{session.user.name}</span>
        <span className="text-xs font-medium  bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-md hover:from-blue-200 hover:to-blue-100  transition rounded-full px-2 py-0.5">
          {session.user.role}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md shadow-2xl border border-gray-100 rounded-xl z-50 overflow-hidden animate-fadeIn">
          {/* Informations utilisateur Format mobile */}

          {/*<div className="p-4 gap-1 border-b border-gray-200 text-gray-700">*/}

          {/*  <span className="text-sm font-semibold">{session.user.name}</span>*/}
          {/*  <span className="text-xs text-gray-500">{session.user.role}</span>*/}
          {/*</div>*/}

          {/* 🔹 Lien vers la page Aide avec icône */}
          <Link
            href="/aide"
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition w-full"
          >
            <HelpCircle className="h-4 w-4" />
            Aide
          </Link>

          {/* 🔹 Séparateur */}
          <div className="border-t border-gray-200 my-1" />

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition rounded-b-xl w-full"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
