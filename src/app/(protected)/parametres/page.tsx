"use client";

import { useState } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import { useEmails } from "@/context/emailsContext";
import { useUtilisateurs } from "@/context/utilisateursContext";
import { useParametresEntretien } from "@/context/parametresEntretienContext";
import TabVehicules from "@/components/vehicules/TabVehicule";
import TabEmails from "@/components/emails/TabEmails";
import TabEntretien from "@/components/entretiens/TabEntretien";
import TabUtilisateurs from "@/components/utilisateurs/TabUtilisateurs";
import TabPassword from "@/components/utilisateurs/TabPassword";

import { ConfirmAction } from "@/types/actions";
import getConfirmMessage from "@/helpers/helperConfirm";
import TabArchive from "@/components/utilisateurs/TabArchive";

import { useSession } from "next-auth/react";

type Onglet =
    | "Véhicules"
    | "Emails"
    | "Mot de passe admin"
    | "Paramètres entretien"
    | "Utilisateurs"
    | "Archivage";

export default function ParametresPage() {

    const { data: session } = useSession();

    console.log("SESSION =>", session?.user);
// tu devrais voir: { id: "1", email: "...", role: "ADMIN" }

    const [activeTab, setActiveTab] = useState<Onglet>("Véhicules");
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);


    const {vehicules, addVehicule, deleteVehicule} = useVehicules();
    const {emails, addEmail, deleteEmail} = useEmails();
    const {utilisateurs, addUtilisateur, deleteUtilisateur, updatePassword} = useUtilisateurs();
   const {parametresEntretien, addParametreEntretien, deleteParametreEntretien,updateParametreEntretien} = useParametresEntretien();






    const currentUserId = session?.user?.id; // ✅ Id de l'utilisateur connecté
    const currentUserRole = session?.user?.role;

    // ===== Gestion des confirmations =====
    const handleConfirm = () => {
        if (!confirmAction) return;
        const { type, target } = confirmAction;
        switch (type) {
            case "valider-vehicule":
                addVehicule(target);
                break;
            case "supprimer-vehicule":
                deleteVehicule(target.id);
                break;
            case "valider-email":
                addEmail(target);
                break;
            case "supprimer-email":
                deleteEmail(target.id ?? target);
                break;
            case "valider-entretien":
                addParametreEntretien(target);
                break;
            case "modifier-entretien":
                updateParametreEntretien(target);
                break;
            case "supprimer-entretien":
                deleteParametreEntretien(target.id);
                break;
            case "valider-utilisateur":
                addUtilisateur(target);
                break;
            case "supprimer-utilisateur":
                deleteUtilisateur(target.id);
                break;
            case "modifier-password":
                const { actuel, nouveau } = target;

                if (!currentUserId) {
                    console.error("Aucun utilisateur connecté");
                    return;
                }

                if (updatePassword) {
                    updatePassword({ id: Number(currentUserId), actuel, nouveau });
                }
                break;
        }
        setConfirmAction(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex gap-6">
            <aside className="w-64 rounded-xl bg-white shadow p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Paramètres</h2>
                <ul className="space-y-2">
                    {["Véhicules","Emails","Mot de passe admin","Paramètres entretien","Utilisateurs","Archivage"].map(tab => (
                        <li key={tab}>
                            <button
                                onClick={() => setActiveTab(tab as Onglet)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                                    activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="flex-1 rounded-xl bg-white shadow border border-gray-200 p-6">
                {activeTab === "Véhicules" && (
                    <TabVehicules
                        vehicules={vehicules}
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Emails" && (
                    <TabEmails
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Paramètres entretien" && (
                    <TabEntretien
                        parametresEntretien={parametresEntretien}
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Utilisateurs" && (
                    <TabUtilisateurs
                        utilisateurs={utilisateurs}
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Mot de passe admin" && (
                    <TabPassword
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Archivage" && (
                    <div>
                   <TabArchive/>
                    </div>
                )}

                {confirmAction && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-white rounded-xl p-6 w-1/3 shadow-lg">
                            <h3 className="text-lg font-bold mb-4">
                                {confirmAction.type.startsWith("supprimer") ? "Confirmer la suppression" : "Confirmer l'action"}
                            </h3>
                            <p className="mb-4">{getConfirmMessage(confirmAction)}</p>
                            <div className="flex justify-end gap-2">
                                <button onClick={handleConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Confirmer</button>
                                <button onClick={() => setConfirmAction(null)} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">Annuler</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}