"use client";

import { useEffect, useMemo, useState } from "react";
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

const onglets = ["Mécanique", "Carrosserie", "Révision", "Dépenses"] as const;

const reparationsOptions: Record<string, string[]> = {
    Mécanique: ["Vidange", "Freins", "Suspension", "Embrayage"],
    Carrosserie: ["Pare-chocs", "Portière", "Peinture", "Pare-brise"],
    Révision: ["Révision générale", "Filtres", "Climatisation", "Batterie"],
};

const prestataires = ["Paul", "Jonny", "Norauto", "Renault Service", "Peugeot Pro"];

const tabToField: Record<typeof onglets[number], string> = {
    Mécanique: "mecanique",
    Carrosserie: "carrosserie",
    Révision: "revision",
    Dépenses: "depenses",
};

// 🔹 Normalisation catégories (supprime accents et met en minuscule)
const normalizeCat = (cat: string) =>
    cat.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function VehiculeDetailPage() {
    const params = useParams();
    const id = Number(params?.id);

    const { vehicules, updateVehicule, depenses, addDepense,deleteDepense, refreshDepenses } = useData();
    const { notifications } = useNotifications();

    const vehicule = vehicules.find((v) => v.id === id) || null;

    const [activeTab, setActiveTab] = useState<typeof onglets[number]>("Mécanique");
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        reparations: "",
        date: "",
        km: 0,
        prestataire: "",
        note: "",
        montant: 0,
    });

    // 🔹 Toujours appelés, même si vehicule est null
    useEffect(() => {
        if (!id) return;
        refreshDepenses(id);
    }, [id, refreshDepenses]);

    // 🔹 Synchro km avec véhicule
    useEffect(() => {
        if (vehicule?.km != null) {
            setForm((f) => ({ ...f, km: vehicule.km }));
        }
    }, [vehicule?.km]);

    // 🔹 Chargement initial des dépenses/historique
    useEffect(() => {
        if (!id) return;
        refreshDepenses(id);
    }, [id, refreshDepenses]);


    const vehiculeNotifications = notifications.filter((n) => n.vehicleId === id);

    const itemsByTab: Record<string, Item[] | any> = {
        Mécanique: depenses.filter((d) => normalizeCat(d.categorie) === "mecanique"),
        Carrosserie: depenses.filter((d) => normalizeCat(d.categorie) === "carrosserie"),
        Révision: depenses.filter((d) => normalizeCat(d.categorie) === "revision"),
        Dépenses: depenses,
    };

    // 🔹 Préparer les données pour le graphique
    const depensesGraph = useMemo(() => {
        const result: Record<string, any> = {};

        depenses.forEach((d) => {
            const date = new Date(d.date);
            const mois = date.toLocaleString("fr-FR", { month: "short" });

            if (!result[mois])
                result[mois] = { mois, mécanique: 0, carrosserie: 0, révision: 0 };

            const cat = normalizeCat(d.categorie);
            if (cat === "mecanique") result[mois].mécanique += d.montant;
            if (cat === "carrosserie") result[mois].carrosserie += d.montant;
            if (cat === "revision") result[mois].révision += d.montant;
        });

        return Object.values(result);
    }, [depenses]);

    // 🔹 Ici seulement on sort si pas trouvé
    if (!vehicule) {
        return <p className="p-6">Chargement du véhicule</p>;
    }

    const handleAddItem = async (newItem: Item) => {
        if (!vehicule) return;

        const newKm = newItem.km > vehicule.km ? newItem.km : vehicule.km;

        // 🔹 Mettre à jour km véhicule
        await updateVehicule({ id: vehicule.id, km: newKm });
        console.log(activeTab,"activeTab")
        // 🔹 Ajouter dépense
        await addDepense({
            vehiculeId: vehicule.id,
            categorie: activeTab,
            reparation: newItem.reparations,
            montant: newItem.montant ?? 0,
            km: newItem.km,
            description: newItem.note ?? "",
            date: newItem.date ? new Date(newItem.date) : new Date(),
        });

        // 🔹 Rafraîchir le contexte
        await refreshDepenses(vehicule.id);

        // 🔹 Reset formulaire
        setForm({
            reparations: "",
            date: "",
            km: newKm,
            prestataire: "",
            note: "",
            montant: 0,
        });
        setShowForm(false);
    };


    const handleDelete = async (depenseId: number) => {
        if (!vehicule) return;
        await deleteDepense(depenseId, vehicule.id);
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-4">

            </div>

            {/* Notifications */}
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
                            handleAddItem={() =>
                                handleAddItem({ ...form, type: activeTab })
                            }
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
                                <BarChart data={depensesGraph}>
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