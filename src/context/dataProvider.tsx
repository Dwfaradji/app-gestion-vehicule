"use client";
import { ReactNode } from "react";
import { VehiculesProvider } from "./vehiculesContext";
import { EmailsProvider } from "./emailsContext";
import { UtilisateursProvider } from "./utilisateursContext";
import { ParametresEntretienProvider } from "./parametresEntretienContext";
import { DepensesProvider } from "./depensesContext";
import { NotificationsProvider } from "./notificationsContext";

export const DataProvider = ({ children }: { children: ReactNode }) => (
    <VehiculesProvider>
        <UtilisateursProvider>
            <EmailsProvider>
                <ParametresEntretienProvider>
                    <DepensesProvider>
                        <NotificationsProvider>
                            {children}
                        </NotificationsProvider>
                    </DepensesProvider>
                </ParametresEntretienProvider>
            </EmailsProvider>
        </UtilisateursProvider>
    </VehiculesProvider>
);