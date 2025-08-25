import {DataProvider} from "@/context/dataProvider";
import SessionProvider from "@/components/ui/SessionProvider";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <DataProvider>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </DataProvider>
        </div>
    );
}