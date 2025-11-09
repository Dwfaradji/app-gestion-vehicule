"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, Settings } from "lucide-react";
import Logout from "@/components/layout/Logout";
import BoutonRetour from "@/components/vehicules/BoutonRetour";
import { Notifications } from "@/components/entretiens/Notifications";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { Button } from "@/components/ui/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const currentPath = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", title: "Accueil" },
    { href: "/vehicules", label: "Véhicules", title: "Liste des véhicules" },
    { href: "/gestions-trajet", label: "Trajets", title: "Gestion des trajets" },
    { href: "/vehicules/depenses", label: "Dépenses", title: "Dépenses Global" },
    { href: "/statistiques-trajets", label: "Statistiques", title: "Statistiques des trajets" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md sticky top-0 z-50 w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto py-3 flex justify-between items-center">
        {/* Left */}

        <Button variant="primary">
          <BoutonRetour />
        </Button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.title}
              className={`relative px-2 py-1 font-medium text-gray-700 hover:text-blue-600 transition
                ${currentPath === link.href ? "text-blue-700 font-semibold" : ""}`}
            >
              {link.label}
              {currentPath === link.href && (
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/*<Notifications />*/}
          <Notifications mode="dropdown" isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          {session?.user?.role === "ADMIN" && (
            <button
              title={"Paramètre de l'application"}
              onClick={() => router.push("/parametres")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          )}

          <Logout />
          <div>
            <DarkModeToggle />
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pt-3 pb-2 animate-slideDown">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition
                ${currentPath === link.href ? "bg-blue-100 text-blue-700 font-semibold" : ""}`}
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

