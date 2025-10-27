"use client";
import type { ReactNode } from "react";
import { VehiculesProvider } from "./vehiculesContext";
import { EmailsProvider } from "./emailsContext";
import { UtilisateursProvider } from "./utilisateursContext";
import { ParametresEntretienProvider } from "./parametresEntretienContext";
import { DepensesProvider } from "./depensesContext";
import { TrajetsProvider } from "@/context/trajetsContext";
import { PlanificationsProvider } from "@/context/planificationsContext";
import EntrepriseProvider from "@/context/entrepriseContext";

export const DataProvider = ({ children }: { children: ReactNode }) => (
  <VehiculesProvider>
    <UtilisateursProvider>
      <EmailsProvider>
        <ParametresEntretienProvider>
          <DepensesProvider>
            <TrajetsProvider>
              <PlanificationsProvider>
                  <EntrepriseProvider>
                {/*<NotificationsProvider>*/}
                {children}
                {/*</NotificationsProvider>*/}
                  </EntrepriseProvider>
              </PlanificationsProvider>
            </TrajetsProvider>
          </DepensesProvider>
        </ParametresEntretienProvider>
      </EmailsProvider>
    </UtilisateursProvider>
  </VehiculesProvider>
);
