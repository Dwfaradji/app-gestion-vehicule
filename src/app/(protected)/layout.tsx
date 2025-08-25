import { Geist, Geist_Mono } from "next/font/google";
import { DataProvider } from "@/context/dataProvider";
import SessionProvider from "@/components/ui/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    return (
        <div>
            <DataProvider>
                <SessionProvider>
                    <Header />
                    {children}
                </SessionProvider>
            </DataProvider>
        </div>
    );
}