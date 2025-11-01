"use client";

import { useTrajets } from "@/context/trajetsContext";
import React, { useState, useEffect } from "react";
import type { Trajet } from "@/types/trajet";
import Table, { Column } from "@/components/ui/Table";
import type { Action } from "@/components/ui/ActionButtons";
import ActionButtons from "@/components/ui/ActionButtons";
import { AnomaliesCell } from "@/components/trajets/AnomaliesCell";
import { Car, Fuel, Users, MapPin, Droplet, CheckCircle2 } from "lucide-react";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";
import { useSpring, animated } from "@react-spring/web";
import { SearchBarAdvanced } from "@/components/ui/SearchBarAdvanced";
import { useClientSearch } from "@/hooks/useClientSearch";
import Pagination from "@/components/ui/Pagination";
import { handleDownloadQRCode } from "@/hooks/handleDownloadQRCode";
import { useVehicules } from "@/context/vehiculesContext";
import PlanifierAttributionModal from "@/components/planification/PlanifierAttributionModal";

export function DetailTrajetPage() {
  const params = useParams();
  const vehiculeId = params?.id ? Number(params.id) : null;

  const { trajets, conducteurs, deleteTrajet, updateTrajet } = useTrajets();
  const { vehicules } = useVehicules();

  const [vehiculeTrajets, setVehiculeTrajets] = useState<Trajet[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Trajet>>({});
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [dernierCarburant, setDernierCarburant] = useState<number>(100);
  const [currentPageData, setCurrentPageData] = useState<Trajet[]>([]);
  const [showFormTrajet, setShowFormTrajet] = useState(false);

  const vehicule = vehicules.find((v) => v.id === vehiculeId);

  const {
    search,
    setSearch,
    selectedVehicule,
    setSelectedVehicule,
    selectedConducteur,
    setSelectedConducteur,
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    heureStart,
    setHeureStart,
    heureEnd,
    setHeureEnd,
    disponibleOnly,
    setDisponibleOnly,
    resetFilters,
    filteredTrajets,
    infosManquantesOnly,
    setInfosManquantesOnly,
  } = useClientSearch({ vehicules, trajets, conducteurs });

  // --- Charger les trajets du véhicule ---
  useEffect(() => {
    if (!vehiculeId) return;

    const sortedTrajets = trajets
      .filter((t) => t.vehiculeId === vehiculeId)
      .sort(
        (a, b) =>
          (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
          (a.createdAt ? new Date(a.createdAt).getTime() : 0),
      );

    // ✅ Déplace tous les setState dans un seul callback différé
    const frameId = requestAnimationFrame(() => {
      setVehiculeTrajets(sortedTrajets);
      setCurrentPageData(sortedTrajets.slice(0, 10));
      setQrCodeUrl(`${window.location.origin}/formulaire-trajet/${vehiculeId}`);
      setDernierCarburant(sortedTrajets[0]?.carburant ?? 100);
    });

    return () => cancelAnimationFrame(frameId);
  }, [trajets, vehiculeId]);

  const springProps = useSpring({
    number: dernierCarburant,
    from: { number: 0 },
    config: { duration: 1000 },
  });

  // --- Éditer / annuler / sauvegarder édition ---
  const startEditing = (t: Trajet) => {
    setEditingRow(t.id);
    setEditValues({ ...t });
  };

  const cancelEditing = () => {
    const current = vehiculeTrajets.find((t) => t.id === editingRow);
    if (current && !current.conducteurId)
      setVehiculeTrajets((prev) => prev.filter((t) => t.id !== editingRow));
    setEditingRow(null);
    setEditValues({});
  };

  const saveEditing = async () => {
    if (editingRow === null) return;
    const original = vehiculeTrajets.find((t) => t.id === editingRow);
    if (!original) return;
    const current: Trajet = { ...original, ...editValues };

    if (!current.conducteurId) {
      setVehiculeTrajets((prev) => prev.filter((t) => t.id !== editingRow));
      cancelEditing();
      return alert("Trajet supprimé car aucun conducteur sélectionné.");
    }

    const anomaliesFinales = Array.from(new Set(current.anomalies ?? []));
    try {
      if (trajets.find((t) => t.id === current.id))
        await updateTrajet({ ...current, anomalies: anomaliesFinales });

      setVehiculeTrajets((prev) => prev.map((t) => (t.id === current.id ? current : t)));
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleDelete = async (id: number) => {
    if (trajets.find((t) => t.id === id)) await deleteTrajet(id);
    setVehiculeTrajets((prev) => prev.filter((t) => t.id !== id));
    if (editingRow === id) cancelEditing();
  };

  const vehiculeUniq = vehicules.filter((v) => v.id === vehiculeId);

  // --- Colonnes dynamiques ---
  const columns: Column<Trajet>[] = [
    {
      key: "conducteurId",
      label: "Conducteur",
      render: (t: Trajet) =>
        editingRow === t.id ? (
          <select
            value={editValues.conducteurId ?? ""}
            onChange={(e) => setEditValues({ ...editValues, conducteurId: Number(e.target.value) })}
            className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Sélectionner --</option>
            {conducteurs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.prenom} {c.nom}
              </option>
            ))}
          </select>
        ) : (
          `${conducteurs.find((c) => c.id === t.conducteurId)?.prenom ?? "-"} ${
            conducteurs.find((c) => c.id === t.conducteurId)?.nom ?? "-"
          }`
        ),
    },
    {
      key: "destination",
      label: "Destination",
      render: (t: Trajet) =>
        editingRow === t.id ? (
          <input
            type="text"
            value={editValues.destination ?? t.destination ?? ""}
            onChange={(e) => setEditValues({ ...editValues, destination: e.target.value })}
            className="w-full rounded border px-2 py-1"
          />
        ) : (
          (t.destination ?? "-")
        ),
    },
    {
      key: "kmDepart",
      label: "Km départ",
      render: (t: Trajet) =>
        editingRow === t.id ? (
          <input
            type="number"
            value={editValues.kmDepart ?? t.kmDepart ?? ""}
            onChange={(e) => setEditValues({ ...editValues, kmDepart: Number(e.target.value) })}
            className="w-20 rounded border px-2 py-1"
          />
        ) : (
          (t.kmDepart ?? "-")
        ),
    },
    {
      key: "kmArrivee",
      label: "Km arrivée",
      render: (t: Trajet) =>
        editingRow === t.id ? (
          <input
            type="number"
            value={editValues.kmArrivee ?? t.kmArrivee ?? ""}
            onChange={(e) => setEditValues({ ...editValues, kmArrivee: Number(e.target.value) })}
            className="w-20 rounded border px-2 py-1"
          />
        ) : (
          (t.kmArrivee ?? "-")
        ),
    },
    {
      //TODO problème avec le type time n'affiche pas le temps
      key: "heureDepart",
      label: "Heure départ",
      render: (t: Trajet) =>
        editingRow === t.id ? (
          <input
            type="time"
            value={editValues.heureDepart ?? t.heureDepart ?? ""}
            onChange={(e) => setEditValues({ ...editValues, heureDepart: e.target.value })}
            className="w-24 rounded border px-2 py-1"
          />
        ) : (
          (t.heureDepart ?? "-")
        ),
    },
    {
      key: "heureArrivee",
      label: "Heure arrivée",
      render: (t: Trajet) =>
        editingRow === t.id ? (
          <input
            type="time"
            value={editValues.heureArrivee ?? t.heureArrivee ?? ""}
            onChange={(e) => setEditValues({ ...editValues, heureArrivee: e.target.value })}
            className="w-24 rounded border px-2 py-1"
          />
        ) : (
          (t.heureArrivee ?? "-")
        ),
    },
    {
      key: "carburant",
      label: "Carburant",
      render: (t: Trajet) =>
        editingRow === t.id ? (
          <input
            type="number"
            value={editValues.carburant ?? t.carburant ?? ""}
            onChange={(e) => setEditValues({ ...editValues, carburant: Number(e.target.value) })}
            className="w-20 rounded border px-2 py-1"
          />
        ) : (
          (t.carburant ?? "-")
        ),
    },
    {
      key: "anomalies",
      label: "Anomalies",
      render: (row: Trajet) => (
        <AnomaliesCell anomalies={row.anomalies} isEditing={editValues.id === row.id} />
      ),
    },
    {
      label: "Actions",
      render: (row: Trajet) => {
        const isEditingRow = editingRow === row.id;
        const actions: Action<Trajet>[] = [
          isEditingRow && { icon: "Save", color: "blue", onClick: saveEditing },
          isEditingRow && { icon: "X", color: "gray", onClick: cancelEditing },
          !isEditingRow && { icon: "Edit2", color: "yellow", onClick: () => startEditing(row) },
          !isEditingRow && { icon: "Trash2", color: "red", onClick: () => handleDelete(row.id) },
        ].filter(Boolean) as Action<Trajet>[];
        return <ActionButtons row={row} buttons={actions} />;
      },
      key: "id",
    },
  ];
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Détails des Trajets du véhicule</h1>

      {vehicule && (
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-8 rounded-3xl shadow-2xl border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-wide">
              {vehicule.type} - {vehicule.modele}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {[
                { label: "Immatriculation", value: vehicule.immat, icon: Car, color: "blue" },
                { label: "Énergie", value: vehicule.energie, icon: Fuel, color: "green" },
                { label: "Places", value: vehicule.places, icon: Users, color: "purple" },
                { label: "Trajets", value: vehiculeTrajets.length, icon: MapPin, color: "yellow" },
                {
                  label: "Carburant",
                  value: dernierCarburant,
                  icon: Droplet,
                  color: "red",
                  isAnimated: true,
                },
                {
                  label: "Statut",
                  value: vehiculeTrajets.length === 0 ? "Disponible" : "En usage",
                  icon: CheckCircle2,
                  color: vehiculeTrajets.length === 0 ? "green" : "yellow",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`bg-${item.color}-50 p-4 rounded-xl shadow-md flex items-center gap-3`}
                  >
                    <Icon className={`text-${item.color}-600`} size={24} />
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs font-medium">{item.label}</span>
                      {item.isAnimated ? (
                        <animated.span>
                          {springProps.number.to((n) => `${Math.round(n)}%`)}
                        </animated.span>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {qrCodeUrl && <QRCode id="qrCode" value={qrCodeUrl} size={160} />}

            <button
              onClick={() => handleDownloadQRCode(vehicule, qrCodeUrl)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Télécharger le QR Code
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowFormTrajet(true)}
          className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
        >
          Ajouter un trajet
        </button>
      </div>

      <PlanifierAttributionModal
        isOpen={showFormTrajet}
        onClose={() => setShowFormTrajet(false)}
        vehicules={vehiculeUniq}
        conducteurs={conducteurs}
      />

      <SearchBarAdvanced
        vehicules={vehicules}
        conducteurs={conducteurs}
        search={search}
        setSearch={setSearch}
        selectedVehicule={selectedVehicule}
        setSelectedVehicule={setSelectedVehicule}
        selectedConducteur={selectedConducteur}
        setSelectedConducteur={setSelectedConducteur}
        dateStart={dateStart}
        setDateStart={setDateStart}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
        heureStart={heureStart}
        setHeureStart={setHeureStart}
        heureEnd={heureEnd}
        setHeureEnd={setHeureEnd}
        disponibleOnly={disponibleOnly}
        setDisponibleOnly={setDisponibleOnly}
        infosManquantesOnly={infosManquantesOnly}
        setInfosManquantesOnly={setInfosManquantesOnly}
        resetFilters={resetFilters}
      />
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 ">
        <h1 className={"text-left font-semibold"}>Trajets du vehicule</h1>
        <Table data={currentPageData} columns={columns} />
      </div>
      <Pagination data={filteredTrajets} itemsPerPage={10} onPageChange={setCurrentPageData} />
    </div>
  );
}
