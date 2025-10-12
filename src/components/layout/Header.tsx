"use client";

import NavBar from "@/components/layout/NavBar";
import Image from "next/image";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200 relative">
        <Image
            src="/backgroundCars.jpg"
            width={1920}
            height={1080}
            quality={100}
            priority
            alt="Illustration connexion"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      <NavBar />
    </header>
  );
};

export default Header;
