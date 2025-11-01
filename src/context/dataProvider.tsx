"use client";
import type { ReactNode } from "react";
import { VehiculesProvider } from "./vehiculesContext";
import { EmailsProvider } from "./emailsContext";
import { UtilisateursProvider } from "./utilisateursContext";
import { ParametresEntretienProvider } from "./parametresEntretienContext";
import { DepensesProvider } from "./depensesContext";
import { TrajetsProvider } from "@/context/trajetsContext";
import { EntrepriseProvider } from "@/context/entrepriseContext";
import { NotificationsProvider } from "@/context/notificationsContext";

export const DataProvider = ({ children }: { children: ReactNode }) => (
  <VehiculesProvider>
    <UtilisateursProvider>
      <EmailsProvider>
        <ParametresEntretienProvider>
          <DepensesProvider>
            <TrajetsProvider>
              <EntrepriseProvider>
                <NotificationsProvider>{children}</NotificationsProvider>
              </EntrepriseProvider>
            </TrajetsProvider>
          </DepensesProvider>
        </ParametresEntretienProvider>
      </EmailsProvider>
    </UtilisateursProvider>
  </VehiculesProvider>
);
