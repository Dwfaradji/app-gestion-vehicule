import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DataProvider } from "@/context/dataProvider";
import SessionProvider from "@/components/ui/SessionProvider";
import Header from "@/components/layout/Header";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // ✅ Vérification sécurisée côté serveur
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <DataProvider>
      <SessionProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
      </SessionProvider>
    </DataProvider>
  );
}
