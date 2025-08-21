"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useNotifications } from "@/context/NotificationsContext";
import { useData } from "@/context/DataContext";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import CarteCT from "@/components/CarteCt";
import CarteInfosVehicule from "@/components/CarteInfosVehicule";
import SidebarOnglets from "@/components/SidebarOnglets";
import FormulaireItem from "@/components/FormulaireAdd";
import ListeItems from "@/components/ListeInterventions";
import BoutonRetour from "@/components/BoutonRetour";
import { Item } from "@/types/vehicule";
import { Notification } from "@/types/entretien";

const onglets = ["Mécanique", "Carrosserie", "Entretien", "Dépenses"] as const;

const reparationsOptions: Record<string, string[]> = {
    Mécanique: ["Vidange", "Freins", "Suspension", "Embrayage"],
    Carrosserie: ["Pare-chocs", "Portière", "Peinture", "Pare-brise"],
    Entretien: ["Révision générale", "Filtres", "Climatisation", "Batterie"],
};

const prestataires = ["Paul", "Jonny", "Norauto", "Renault Service", "Peugeot Pro"];

export default function VehiculeDetailPage() {
    const params = useParams();
    const id = Number(params?.id);

    // 🔹 Ajout de addDepense ici
    const { vehicules, updateVehicule, depenses, addDepense } = useData();
    const { notifications } = useNotifications();

    const vehicule = vehicules.find((v) => v.id === id) || null;

    const [activeTab, setActiveTab] = useState<typeof onglets[number]>("Mécanique");
    const [showForm, setShowForm] = useState(false);

    if (!vehicule) return <p className="p-6">Véhicule introuvable</p>;

    const vehiculeNotifications = notifications.filter((n) => n.vehicleId === id);

    const itemsByTab: Record<string, Item[] | any> = {
        Mécanique: vehicule.mecanique,
        Carrosserie: vehicule.carrosserie,
        Entretien: vehicule.revision,
        Dépenses: vehicule.depenses,
    };

    const [form, setForm] = useState({
        reparations: "",
        date: "",
        km: 0,
        prestataire: "",
        note: "",
        montant: 0, // 💰 Ajout d’un champ montant pour la dépense
    });

    const handleAddItem = async (newItem: Item) => {
        // 🔹 Mettre à jour le véhicule avec le nouvel item
        const updatedVehicule = {
            ...vehicule,
            [activeTab.toLowerCase()]: [...(itemsByTab[activeTab] || []), newItem],
        };
        updateVehicule(updatedVehicule);

        // 🔹 Enregistrer la dépense correspondante
        await addDepense({
            categorie: activeTab, // "Mécanique" | "Carrosserie" | "Entretien"
            montant: newItem.montant ?? 0,
            description: newItem.note,
            vehiculeId: vehicule.id,
        });

        setShowForm(false);
    };

    const handleDelete = (idx: number) => {
        const updatedVehicule = {
            ...vehicule,
            [activeTab.toLowerCase()]: itemsByTab[activeTab].filter(
                (_: any, i: number) => i !== idx
            ),
        };
        updateVehicule(updatedVehicule);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-4">
                <BoutonRetour />
            </div>

            {/* 🔔 Notifications */}
            {vehiculeNotifications.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-100 text-yellow-900 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    <ul className="list-disc list-inside">
                        {vehiculeNotifications.map((n: Notification, idx) => (
                            <li key={idx}>
                                {n.message} {!n.seen && <span className="font-bold">● Nouveau</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex justify-between mb-6 gap-6">
                <CarteCT ctValidite={vehicule.ctValidite} />
                <CarteInfosVehicule vehicule={vehicule} />
            </div>

            <div className="flex gap-6">
                <SidebarOnglets
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setShowForm={setShowForm}
                />

                <main className="flex-1 rounded-xl bg-white shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">{activeTab}</h2>

                    {/* Bouton d’ajout */}
                    {activeTab !== "Dépenses" && !showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 mb-4"
                        >
                            + Ajouter
                        </button>
                    )}

                    {/* Formulaire */}
                    {showForm && activeTab !== "Dépenses" && (
                        <FormulaireItem
                            form={form}
                            setForm={setForm}
                            handleAddItem={() => {
                                handleAddItem({ ...form, type: activeTab });
                                setForm({
                                    reparations: "",
                                    date: "",
                                    km: 0,
                                    prestataire: "",
                                    note: "",
                                    montant: 0,
                                }); // reset
                            }}
                            setShowForm={setShowForm}
                            options={{
                                reparations: reparationsOptions[activeTab],
                                prestataires,
                                kmPlaceholder: "Kilométrage",
                            }}
                        />
                    )}

                    {/* Liste des items */}
                    {activeTab !== "Dépenses" && (
                        <ListeItems
                            items={itemsByTab[activeTab] || []}
                            activeTab={activeTab}
                            handleDelete={handleDelete}
                        />
                    )}

                    {/* Graphique des dépenses */}
                    {activeTab === "Dépenses" && (
                        <div className="h-72 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={vehicule.depenses || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mois" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="mécanique" fill="#3b82f6" name="Mécanique" />
                                    <Bar dataKey="carrosserie" fill="#10b981" name="Carrosserie" />
                                    <Bar dataKey="révision" fill="#f59e0b" name="Révision" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}