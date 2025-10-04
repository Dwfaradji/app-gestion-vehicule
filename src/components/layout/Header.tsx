"use client";

import {  Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Logout from "@/components/layout/Logout";
import BoutonRetour from "@/components/vehicules/BoutonRetour";
import Notifications from "@/components/entretiens/Notifications";

const Header = () => {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200 relative">
            <div className="flex items-center gap-4">
                <BoutonRetour />
            </div>



            <div className="flex items-center gap-4">
                {/* Notifications */}
                <Notifications />


                {session?.user?.role === "ADMIN" && (
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        onClick={() => router.push("/parametres")}
                    >
                        <Settings className="h-6 w-6 text-gray-600" />
                    </button>
                )}

                <Logout />
            </div>
        </header>
    );
};

export default Header;