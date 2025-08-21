import { Geist, Geist_Mono } from "next/font/google";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { DataProvider } from "@/context/DataContext";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";



export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    return (
        <div>
        <NotificationsProvider>
            <DataProvider>
                <SessionProvider>
                   <Header />
                       {children}
                </SessionProvider>
            </DataProvider>
        </NotificationsProvider>
        </div>
    );
}