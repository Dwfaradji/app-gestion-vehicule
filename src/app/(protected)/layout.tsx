import { DataProvider } from "@/context/dataProvider";
import SessionProvider from "@/components/ui/SessionProvider";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import {getServerSession} from "next-auth";

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