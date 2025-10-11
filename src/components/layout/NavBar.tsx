"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, Settings } from "lucide-react";
import Notifications from "@/components/entretiens/Notifications";
import Logout from "@/components/layout/Logout";
import BoutonRetour from "@/components/vehicules/BoutonRetour";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/vehicules", label: "Véhicules" },
    { href: "/gestions-trajet", label: "Gestion des trajets" },
    { href: "/vehicules/depenses", label: "Dépenses" },
    {
      label: "Statistiques trajets",
      href: "/statistiques-trajets",
      icon: "BarChart3", // ou un autre icône lucide-react
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 sticky top-0 z-50 w-full ">
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
        {/* Gauche */}
        <div className="flex items-center gap-4 ">
          <BoutonRetour />
        </div>

        {/* Liens (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Droite */}
        <div className="flex items-center gap-4  ">
          <Notifications />

          {session?.user?.role === "ADMIN" && (
            <button
              onClick={() => router.push("/parametres")}
              className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          )}

          <Logout />

          {/* Bouton menu mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="mt-3 flex flex-col gap-3 md:hidden bg-white border-t border-gray-100 pt-3 pb-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
