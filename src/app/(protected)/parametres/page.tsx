"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import TabVehicules from "@/components/params/TabVehicule";
import TabEmails from "@/components/params/TabEmails";
import TabEntretien from "@/components/params/TabEntretien";
import TabUtilisateurs from "@/components/params/TabUtilisateurs";
import TabPassword from "@/components/params/TabPassword";
import BoutonRetour from "@/components/BoutonRetour";



type Onglet =
    | "Véhicules"
    | "Emails"
    | "Mot de passe admin"
    | "Paramètres entretien"
    | "Utilisateurs"
    | "Archivage";

type ConfirmAction =
    | { type: "valider-vehicule"; target: any }
    | { type: "supprimer-vehicule"; target: any }
    | { type: "valider-email"; target: string }
    | { type: "supprimer-email"; target: string }
    | { type: "valider-entretien"; target: any }
    | { type: "supprimer-entretien"; target: any }
    | { type: "valider-utilisateur"; target: any }
    | { type: "supprimer-utilisateur"; target: any }
    | { type: "modifier-password"; target: any }
    | { type: "archiver"; target: null };

export default function ParametresPage() {

    const [activeTab, setActiveTab] = useState<Onglet>("Véhicules");
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

    const {
        vehicules,
        addVehicule,
        deleteVehicule,
        emails,
        addEmail,
        deleteEmail,
        utilisateurs,
        addUtilisateur,
        deleteUtilisateur,
        parametresEntretien,
        addParametreEntretien,
        deleteParametreEntretien,
    } = useData();

    // Formulaires
    const [formVehicule, setFormVehicule] = useState({});
    const [showFormVehicule, setShowFormVehicule] = useState(false);

    const [formEmail, setFormEmail] = useState("");
    const [showFormEmail, setShowFormEmail] = useState(false);

    const [formEntretien, setFormEntretien] = useState({ type: "", seuilKm: 0 });
    const [showFormEntretien, setShowFormEntretien] = useState(false);

    const [formUtilisateur, setFormUtilisateur] = useState({ nom: "", fonction: "" });
    const [showFormUtilisateur, setShowFormUtilisateur] = useState(false);

    const [formPassword, setFormPassword] = useState({ actuel: "", nouveau: "", confirmer: "" });

    // ===== Gestion des confirmations =====
    const handleConfirm = () => {
        if (!confirmAction) return;
        const { type, target } = confirmAction;

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
                setFormEntretien({ type: "", seuilKm: 0 });
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
                console.log("Mot de passe changé :", formPassword);
                setFormPassword({ actuel: "", nouveau: "", confirmer: "" });
                break;
            case "archiver":
                console.log("Archivage confirmé");
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
                        <h2 className="text-xl font-bold mb-4">Archivage des données</h2>
                        <button
                            onClick={() => setConfirmAction({ type: "archiver", target: null })}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 mb-3"
                        >
                            Archiver / Exporter
                        </button>
                    </div>
                )}

                {confirmAction && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-white rounded-xl p-6 w-1/3 shadow-lg">
                            <h3 className="text-lg font-bold mb-4">
                                {confirmAction.type.startsWith("supprimer") ? "Confirmer la suppression" : "Confirmer l'action"}
                            </h3>
                            <p className="mb-4">
                                {confirmAction.type.startsWith("supprimer") &&
                                    `Voulez-vous vraiment supprimer ${confirmAction.target?.immat || confirmAction.target?.nom || ""}?`}
                                {confirmAction.type.startsWith("valider") &&
                                    `Confirmez-vous l'ajout de ${confirmAction.target?.immat || confirmAction.target || ""}?`}
                                {confirmAction.type === "modifier-password" && `Voulez-vous changer le mot de passe admin ?`}
                                {confirmAction.type === "archiver" && `Confirmez-vous l'archivage / export des données ?`}
                            </p>
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