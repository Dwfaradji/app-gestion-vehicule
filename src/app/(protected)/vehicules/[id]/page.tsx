"use client";

import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { useVehicules } from "@/context/vehiculesContext";
import { useDepenses } from "@/context/depensesContext";

import CarteCT from "@/components/vehicules/CarteCt";
import CarteInfosVehicule from "@/components/vehicules/CarteInfosVehicule";
import SidebarOnglets from "@/components/layout/SideBar/SidebarOnglets";
import OngletVehicule from "@/components/vehicules/OngletVehicule";
import DepensesGraph from "@/components/entretiens/DepensesGraph";
import type { Item } from "@/types/entretien";
import { mapDepenseToItem } from "@/helpers/helperMapperDepense";
import { useNotifications } from "@/context/notificationsContext";
import Loader from "@/components/layout/Loader";
import NotificationsListByVehicule from "@/components/vehicules/NotificationListByVehicule";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import Collapsible from "@/components/ui/Collapsible";
import { normalizeCat } from "@/utils/normalizeCat";

const onglets = ["Mécanique", "Carrosserie", "Révision", "Dépenses"] as const;
const intervenant = ["Paul", "Jonny", "Norauto", "Renault Service", "Peugeot Pro"];

export default function VehiculeDetailPage() {
  const params = useParams();
  const id = Number(params?.id);

  const { depenses, addDepense, deleteDepense } = useDepenses();
  const { vehicules } = useVehicules();
  const isLoading = useGlobalLoading();

  const vehicule = vehicules.find((v) => v.id === id) || null;

  const { getNotifByVehicle, markAsRead, markAnimationDone } = useNotifications();

  const [activeTab, setActiveTab] = useState<(typeof onglets)[number]>("Mécanique");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Item>({
    id: 0,
    categorie: "",
    reparation: "",
    itemId: 0,
    date: "",
    km: 0,
    intervenant: "",
    note: "",
    montant: 0,
  });

  // 🔹 Initialisation des données
  useEffect(() => {
    if (vehicule?.km != null) {
      startTransition(() => {
        setForm((f) => ({ ...f, km: vehicule.km }));
      });
    }
  }, [vehicule?.km]);

  // 🔹 Notifications du véhicule
  const [animatedIds, setAnimatedIds] = useState<number[]>([]);
  const vehiculeNotifications = getNotifByVehicle(id);

  // Animation des nouvelles notifications
  const triggerAnimation = useCallback(
    (notifId: number) => {
      setAnimatedIds((prev) => [...prev, notifId]);
      setTimeout(() => {
        setAnimatedIds((prev) => prev.filter((nid) => nid !== notifId));
        markAnimationDone(notifId);
      }, 1000);
    },
    [markAnimationDone],
  );

  useEffect(() => {
    vehiculeNotifications.forEach((n) => {
      if (n.id && n.new && !animatedIds.includes(n.id)) {
        triggerAnimation(n.id);
      }
    });
  }, [vehiculeNotifications, animatedIds, markAnimationDone, triggerAnimation]);
  // Items par onglet
  const itemsByTab = useMemo(() => {
    const result = {} as Record<(typeof onglets)[number], Item[]>;
    onglets.forEach((tab) => {
      result[tab] =
        tab === "Dépenses"
          ? depenses.map(mapDepenseToItem)
          : depenses
              .filter((d) => normalizeCat(d.categorie) === normalizeCat(tab))
              .map(mapDepenseToItem);
    });
    return result;
  }, [depenses]);

  if (isLoading || !vehicule) {
    return (
      <Loader
        message="Chargement du véhicule ..."
        isLoading={isLoading}
        skeleton={"none"}
        fullscreen
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Notifications */}
      <div className="mb-6">
        <Collapsible
          title={`Notifications ${vehicule.modele} ${vehiculeNotifications.length > 0 ? `(${vehiculeNotifications.length})` : ""}`}
          defaultOpen={false}
        >
          <NotificationsListByVehicule
            notifications={vehiculeNotifications}
            markAsRead={markAsRead}
          />
        </Collapsible>
      </div>

      {/* Cartes véhicule */}
      <div className="flex justify-between mb-6 gap-6">
        <CarteCT vehiculeId={vehicule.id} ctValidite={vehicule.ctValidite} />
        <CarteInfosVehicule vehicule={vehicule} />
      </div>

      {/* Contenu principal */}
      <div className="flex gap-6">
        <SidebarOnglets
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowForm={setShowForm}
        />

        <main className="flex-1 rounded-xl bg-white shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">{activeTab}</h2>

          {/* Onglet spécifique */}
          {activeTab !== "Dépenses" && (
            <OngletVehicule
              vehiculeId={vehicule.id}
              activeTab={activeTab}
              items={itemsByTab[activeTab] || []}
              form={form}
              setForm={setForm}
              showForm={showForm}
              setShowForm={setShowForm}
              intervenant={intervenant}
              addDepense={addDepense}
              deleteDepense={deleteDepense}
              vehiculeKm={vehicule.km}
              prochaineRevision={vehicule.prochaineRevision}
              dateEntretien={vehicule.dateEntretien}
            />
          )}

          {/* Graphique Dépenses */}
          {activeTab === "Dépenses" && <DepensesGraph depenses={depenses} />}
        </main>
      </div>
    </div>
  );
}
