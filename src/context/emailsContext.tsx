"use client";
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from "react";
import { Email } from "@/types/entretien";

interface EmailsContextProps {
    emails: Email[];
    refreshEmails: () => Promise<void>;
    addEmail: (adresse: string) => Promise<void>;
    updateEmail: (id: number, adresse: string) => Promise<void>;
    deleteEmail: (id: number) => Promise<void>;
}

const EmailsContext = createContext<EmailsContextProps | undefined>(undefined);

export const EmailsProvider = ({ children }: { children: ReactNode }) => {
    const [emails, setEmails] = useState<Email[]>([]);

    const refreshEmails = useCallback(async () => {
        const res = await fetch("/api/emails");
        const data: Email[] = await res.json();
        setEmails(data);
    }, []);

    const addEmail = useCallback(async (adresse: string) => {
        console.log(adresse)
        if (!adresse) return;
        const res = await fetch("/api/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( adresse ),
        });
        if (res.ok) await refreshEmails();
        else console.error("Erreur ajout email:", await res.json());
    }, [refreshEmails]);

    const updateEmail = useCallback(async (id: number, adresse: string) => {
        if (!id || !adresse) return;
        const res = await fetch("/api/emails", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, adresse }),
        });
        if (res.ok) await refreshEmails();
        else console.error("Erreur update email:", await res.json());
    }, [refreshEmails]);

    const deleteEmail = useCallback(async (id: number) => {
        console.log(id,"id")
        if (!id) return;
        const res = await fetch("/api/emails", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) await refreshEmails();
        else console.error("Erreur delete email:", await res.json());
    }, [refreshEmails]);

    useEffect(() => {
        refreshEmails();
    }, [refreshEmails]);

    return (
        <EmailsContext.Provider value={{ emails, refreshEmails, addEmail, updateEmail, deleteEmail }}>
            {children}
        </EmailsContext.Provider>
    );
};

export const useEmails = () => {
    const context = useContext(EmailsContext);
    if (!context) throw new Error("useEmails must be used within EmailsProvider");
    return context;
};