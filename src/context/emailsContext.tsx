"use client";

import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Email } from "@/types/entretien";

interface EmailsContextType {
  emails: Email[];
  loading: boolean;

  addEmail: (adresse: string) => Promise<Email>;
  updateEmail: (id: number, adresse: string) => Promise<Email>;
  deleteEmail: (id: number) => Promise<void>;
}

const EmailsContext = createContext<EmailsContextType | undefined>(undefined);

export function EmailsProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------
  // 🔄 INIT
  // ---------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api<Email[]>("/api/emails");
        setEmails(data);
      } catch (err) {
        toast.error("Erreur lors du chargement des emails");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------------------------------
  // 🏷 CRUD
  // ---------------------------------
  const addEmail = useCallback(async (adresse: string) => {
    const newEmail = await api<Email>("/api/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adresse }),
    });
    setEmails((prev) => [...prev, newEmail]);
    toast.success("Email ajouté");
    return newEmail;
  }, []);

  const updateEmail = useCallback(async (id: number, adresse: string) => {
    const updated = await api<Email>("/api/emails", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adresse }),
    });
    setEmails((prev) => prev.map((e) => (e.id === id ? updated : e)));
    toast.success("Email mis à jour");
    return updated;
  }, []);

  const deleteEmail = useCallback(async (id: number) => {
    await api("/api/emails", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
      console.log(id)

    setEmails((prev) => prev.filter((e) => e.id !== id));
    toast.success("Email supprimé");
  }, []);

  // ---------------------------------
  // 🧩 RENDER
  // ---------------------------------
  return (
    <EmailsContext.Provider value={{ emails, loading, addEmail, updateEmail, deleteEmail }}>
      {children}
    </EmailsContext.Provider>
  );
}

export function useEmails() {
  const context = useContext(EmailsContext);
  if (!context) throw new Error("useEmails doit être utilisé à l’intérieur d’un EmailsProvider");
  return context;
}
