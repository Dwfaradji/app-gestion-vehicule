"use client";

import { useState } from "react";
import { useVehicules } from "@/context/vehiculesContext";
import { useEmails } from "@/context/emailsContext";
import { useUtilisateurs, usePassword } from "@/context/utilisateursContext";
import { useParametresEntretien } from "@/context/parametresEntretienContext";
import TabVehicules from "@/components/vehicules/TabVehicule";
import TabEmails from "@/components/emails/TabEmails";
import TabEntretien from "@/components/entretiens/TabEntretien";
import TabUtilisateurs from "@/components/utilisateurs/TabUtilisateurs";
import TabPassword from "@/components/utilisateurs/TabPassword";

import { ConfirmAction } from "@/types/actions";
import getConfirmMessage from "@/helpers/helperConfirm";
import {updateUser} from "rc9";
import TabArchive from "@/components/utilisateurs/TabArchive";

type Onglet =
    | "Véhicules"
    | "Emails"
    | "Mot de passe admin"
    | "Paramètres entretien"
    | "Utilisateurs"
    | "Archivage";

export default function ParametresPage() {

    const [activeTab, setActiveTab] = useState<Onglet>("Véhicules");
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);


    const {vehicules, addVehicule, deleteVehicule} = useVehicules();
    const {emails, addEmail, deleteEmail} = useEmails();
    const {utilisateurs, addUtilisateur, deleteUtilisateur, updateUtilisateur, updatePassword} = useUtilisateurs();
    const {parametresEntretien, addParametreEntretien, deleteParametreEntretien,updateParametreEntretien} = useParametresEntretien();


    // Formulaires
    const [formVehicule, setFormVehicule] = useState({});
    const [showFormVehicule, setShowFormVehicule] = useState(false);

    const [formEmail, setFormEmail] = useState("");
    const [showFormEmail, setShowFormEmail] = useState(false);

    const [formEntretien, setFormEntretien] = useState({ });
    const [showFormEntretien, setShowFormEntretien] = useState(false);

    const [formUtilisateur, setFormUtilisateur] = useState({ nom: "", fonction: "" });
    const [showFormUtilisateur, setShowFormUtilisateur] = useState(false);

    const [formPassword, setFormPassword] = useState({ actuel: "", nouveau: "", confirmer: "" });

    // ===== Gestion des confirmations =====
    const handleConfirm = () => {
        if (!confirmAction) return;
        const { type, target } = confirmAction;
        console.log(confirmAction)
        switch (type) {
            case "valider-vehicule":
                addVehicule(target);
                setFormVehicule({});
                setShowFormVehicule(false);
                break;
            case "supprimer-vehicule":
                deleteVehicule(target.id);
                break;
            case "valider-email":
                addEmail(target);
                setFormEmail("");
                setShowFormEmail(false);
                break;
            case "supprimer-email":
                deleteEmail(target.id ?? target);
                break;
            case "valider-entretien":
                addParametreEntretien(target);
                setFormEntretien({});
                setShowFormEntretien(false);
                break;
            case "supprimer-entretien":
                deleteParametreEntretien(target.id);
                break;
            case "valider-utilisateur":
                addUtilisateur(target);
                setFormUtilisateur({ nom: "", fonction: "" });
                setShowFormUtilisateur(false);
                break;
            case "supprimer-utilisateur":
                deleteUtilisateur(target.id);
                break;
            case "modifier-password":
                const { actuel, nouveau } = formPassword;
                // Récupérer l'utilisateur courant (ici j'utilise le premier admin trouvé, adapte selon ton besoin)
                const userId = utilisateurs?.find(u => u.role === "ADMIN")?.id;
                if (userId && updatePassword) {
                    updatePassword({ id: userId, actuel, nouveau })
                        .then(() => console.log("Mot de passe mis à jour"))
                        .catch(err => console.error("Erreur changement mot de passe:", err));
                }
                setFormPassword({ actuel: "", nouveau: "", confirmer: "" });
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
                        formVehicule={formVehicule}
                        setFormVehicule={setFormVehicule}
                        showForm={showFormVehicule}
                        setShowForm={setShowFormVehicule}
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Emails" && (
                    <TabEmails
                        emails={emails}
                        formEmail={formEmail}
                        setFormEmail={setFormEmail}
                        showForm={showFormEmail}
                        setShowForm={setShowFormEmail}
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Paramètres entretien" && (
                    <TabEntretien
                        parametresEntretien={parametresEntretien}
                        formEntretien={formEntretien}
                        setFormEntretien={setFormEntretien}
                        showForm={showFormEntretien}
                        setShowForm={setShowFormEntretien}
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Utilisateurs" && (
                    <TabUtilisateurs
                        utilisateurs={utilisateurs}
                        formUtilisateur={formUtilisateur}
                        setFormUtilisateur={setFormUtilisateur}
                        showForm={showFormUtilisateur}
                        setShowForm={setShowFormUtilisateur}
                        setConfirmAction={setConfirmAction}
                    />
                )}

                {activeTab === "Mot de passe admin" && (
                    <TabPassword
                        formPassword={formPassword}
                        setFormPassword={setFormPassword}
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