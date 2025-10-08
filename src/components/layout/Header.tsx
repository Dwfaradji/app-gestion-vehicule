"use client";

import NavBar from "@/components/layout/NavBar";

const Header = () => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200 relative">
                <NavBar/>
        </header>
    );
};

export default Header;