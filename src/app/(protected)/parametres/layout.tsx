// src/app/(pages)/parametres/layout.tsx
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {getServerSession} from "next-auth";

export default async function ParametresLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "ADMIN") {
        redirect("/auth/login");
    }

    return <>{children}</>;
}