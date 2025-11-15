import { DataProvider } from "@/context/dataProvider";
import SessionProvider from "@/components/ui/SessionProvider";
import Header from "@/components/layout/Header";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <SessionProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
      </SessionProvider>
    </DataProvider>
  );
}
