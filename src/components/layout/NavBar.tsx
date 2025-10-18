"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, Settings } from "lucide-react";
import Logout from "@/components/layout/Logout";
import BoutonRetour from "@/components/vehicules/BoutonRetour";
import { Notifications } from "@/components/entretiens/Notifications";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const currentPath = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/vehicules", label: "Véhicules" },
    { href: "/gestions-trajet", label: "Gestion des trajets" },
    { href: "/vehicules/depenses", label: "Dépenses" },
    { href: "/statistiques-trajets", label: "Statistiques trajets" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md sticky top-0 z-50 w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-4">
          <BoutonRetour />
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
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
              onClick={() => router.push("/parametres")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          )}

          <Logout />

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

// "use client";
//
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Menu, X, Settings } from "lucide-react";
// import Notifications from "@/components/entretiens/Notifications";
// import Logout from "@/components/layout/Logout";
// import BoutonRetour from "@/components/vehicules/BoutonRetour";
//
// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useRouter();
//   const { data: session } = useSession();
//
//   const toggleMenu = () => setIsOpen(!isOpen);
//
//   const navLinks = [
//     { href: "/vehicules", label: "Véhicules" },
//     { href: "/gestions-trajet", label: "Gestion des trajets" },
//     { href: "/vehicules/depenses", label: "Dépenses" },
//     {
//       label: "Statistiques trajets",
//       href: "/statistiques-trajets",
//       icon: "BarChart3", // ou un autre icône lucide-react
//     },
//   ];
//
//   return (
//     <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 sticky top-0 z-50 w-full ">
//       <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
//         {/* Gauche */}
//         <div className="flex items-center gap-4 ">
//           <BoutonRetour />
//         </div>
//
//         {/* Liens (desktop) */}
//         <div className="hidden md:flex items-center gap-6">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="text-gray-700 font-medium hover:text-blue-600 transition"
//             >
//               {link.label}
//             </Link>
//           ))}
//         </div>
//
//         {/* Droite */}
//         <div className="flex items-center gap-4  ">
//           <Notifications />
//
//           {session?.user?.role === "ADMIN" && (
//             <button
//               onClick={() => router.push("/parametres")}
//               className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
//             >
//               <Settings className="h-5 w-5 text-gray-600" />
//             </button>
//           )}
//
//           <Logout />
//
//           {/* Bouton menu mobile */}
//           <button
//             onClick={toggleMenu}
//             className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
//           >
//             {isOpen ? (
//               <X className="h-6 w-6 text-gray-700" />
//             ) : (
//               <Menu className="h-6 w-6 text-gray-700" />
//             )}
//           </button>
//         </div>
//       </div>
//
//       {/* Menu mobile */}
//       {isOpen && (
//         <div className="mt-3 flex flex-col gap-3 md:hidden bg-white border-t border-gray-100 pt-3 pb-2">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               onClick={() => setIsOpen(false)}
//               className="px-3 py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition"
//             >
//               {link.label}
//             </Link>
//           ))}
//         </div>
//       )}
//     </nav>
//   );
// };
//
// export default Navbar;
