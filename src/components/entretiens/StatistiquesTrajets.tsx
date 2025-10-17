"use client";

import React, { useMemo, useState, useRef } from "react";
import { useTrajets } from "@/context/trajetsContext";
import { useVehicules } from "@/context/vehiculesContext";
import ArchiveButton from "@/components/ui/ArchiveButton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Table from "@/components/ui/Table";
import {
  Car,
  MapPin,
  Droplet,
  Clock,
  BarChart3,
  LineChartIcon,
  Download,
  Truck,
} from "lucide-react";
import clsx from "clsx";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import Cards from "@/components/ui/Cards";
import Collapsible from "@/components/ui/Collapsible";
import Dropdown from "@/components/ui/Dropdown";
import useStats from "@/hooks/useStats";
import type { Trajet } from "@/types/trajet";

export default function StatistiquesTrajetsPage() {
  const { trajets = [], conducteurs = [] } = useTrajets();
  const { vehicules = [] } = useVehicules();

  const [periode, setPeriode] = useState<"jour" | "mois" | "année">("jour");
  const [selectedVehicule, setSelectedVehicule] = useState<number | "all">("all");
  const [selectedConducteur, setSelectedConducteur] = useState<number | "all">("all");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [visibleMetrics, setVisibleMetrics] = useState({
    trajets: true,
    km: true,
    carburant: true,
    duree: true,
  });

  const exportRef = useRef<HTMLDivElement>(null);

  // 🧠 Trajets complets uniquement
  const trajetsComplets = useMemo(
    () =>
      trajets.filter(
        (t) =>
          t.kmDepart != null &&
          t.kmArrivee != null &&
          t.heureDepart &&
          t.heureArrivee &&
          t.destination,
      ),
    [trajets],
  );

  // 🔍 Filtres
  const filteredTrajets = useMemo(() => {
    return trajetsComplets.filter((t) => {
      const vehiculeMatch = selectedVehicule === "all" || t.vehiculeId === selectedVehicule;
      const conducteurMatch = selectedConducteur === "all" || t.conducteurId === selectedConducteur;
      return vehiculeMatch && conducteurMatch;
    });
  }, [trajetsComplets, selectedVehicule, selectedConducteur]);

  // 📊 Données graphique
  const chartData = useMemo(() => {
    const grouped: Record<
      string,
      { trajets: number; km: number; carburant: number; duree: number }
    > = {};
    filteredTrajets.forEach((t) => {
      if (!t.createdAt) return;
      const date = new Date(t.createdAt);
      const key =
        periode === "jour"
          ? date.toLocaleDateString()
          : periode === "mois"
            ? `${date.getMonth() + 1}/${date.getFullYear()}`
            : `${date.getFullYear()}`;

      const km = (t.kmArrivee ?? 0) - (t.kmDepart ?? 0);
      const carburant = t.carburant ?? 0;
      let duree = 0;
      if (t.heureDepart && t.heureArrivee) {
        const [hdH, hdM] = t.heureDepart.split(":").map(Number);
        const [haH, haM] = t.heureArrivee.split(":").map(Number);
        duree = haH * 60 + haM - (hdH * 60 + hdM);
        if (duree < 0) duree += 24 * 60;
      }

      if (!grouped[key]) grouped[key] = { trajets: 0, km: 0, carburant: 0, duree: 0 };
      grouped[key].trajets += 1;
      grouped[key].km += km;
      grouped[key].carburant += carburant;
      grouped[key].duree += duree / 60; // heures
    });

    return Object.entries(grouped)
      .map(([key, data]) => ({
        periode: key,
        trajets: data.trajets,
        km: Math.round(data.km),
        carburant: Number(data.carburant.toFixed(1)),
        duree: Number(data.duree.toFixed(1)),
      }))
      .sort((a, b) => new Date(a.periode).getTime() - new Date(b.periode).getTime());
  }, [filteredTrajets, periode]);

  const colors = { trajets: "#2563eb", km: "#16a34a", carburant: "#dc2626", duree: "#facc15" };
  const metrics = [
    { key: "trajets", label: "Trajets" },
    { key: "km", label: "Distance (km)" },
    { key: "carburant", label: "Carburant (L)" },
    { key: "duree", label: "Durée (h)" },
  ] as const;

  // 📥 Export PDF multi-pages
  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvas = await html2canvas(exportRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("statistiques-trajets.pdf");
  };

  // 🧱 Stats résumé
  const statsTrajets = useStats<Trajet>({
    data: trajets,
    metrics: [
      { label: "Trajets effectués", value: (t) => t.length, color: "blue", icon: MapPin },
      {
        label: "Km total",
        value: (t) => t.reduce((acc, tr) => acc + ((tr.kmArrivee ?? 0) - (tr.kmDepart ?? 0)), 0),
        color: "purple",
        icon: Truck,
      },
      {
        label: "Carburant",
        value: (t) => t.reduce((acc, tr) => acc + (tr.carburant ?? 0), 0),
        color: "red",
        icon: Droplet,
      },
      {
        label: "Durée totale",
        value: (t) => {
          const totalMin = t.reduce((acc, tr) => {
            if (!tr.heureDepart || !tr.heureArrivee) return acc;
            const [hD, mD] = tr.heureDepart.split(":").map(Number);
            const [hA, mA] = tr.heureArrivee.split(":").map(Number);
            let diff = hA * 60 + mA - (hD * 60 + mD);
            if (diff < 0) diff += 24 * 60;
            return acc + diff;
          }, 0);
          return `${Math.floor(totalMin / 60)}h ${String(totalMin % 60).padStart(2, "0")}m`;
        },
        color: "yellow",
        icon: Clock,
      },
    ],
  });

  return (
    <div className="p-8  min-h-screen space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Statistiques des trajets</h1>

        <Dropdown label="Exporter les données">
          <div className="flex flex-col gap-2 p-2">
            <ArchiveButton
              endpoint="/api/archive?type=vehicules"
              filename="vehicules.pdf"
              label="Exporter les véhicules"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
            />
            <ArchiveButton
              endpoint="/api/archive?type=trajets"
              filename="trajets.pdf"
              label="Exporter les trajets"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
            />
            <ArchiveButton
              endpoint="/api/archive?type=depenses"
              filename="depenses.pdf"
              label="Exporter les dépenses"
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-shadow shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
            />
          </div>
        </Dropdown>
      </div>

      {/* Cards */}
      <Cards cards={statsTrajets} />

      {/* Filtres + Export PDF */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow border border-gray-200">
        <select
          value={periode}
          onChange={(e) => setPeriode(e.target.value as "jour" | "mois" | "année")}
          className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
        >
          <option value="jour">Jour</option>
          <option value="mois">Mois</option>
          <option value="année">Année</option>
        </select>
        <select
          value={selectedConducteur}
          onChange={(e) =>
            setSelectedConducteur(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
        >
          <option value="all">Tous les conducteurs</option>
          {conducteurs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.prenom} {c.nom}
            </option>
          ))}
        </select>
        <select
          value={selectedVehicule}
          onChange={(e) =>
            setSelectedVehicule(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
        >
          <option value="all">Tous les véhicules</option>
          {vehicules.map((v) => (
            <option key={v.id} value={v.id}>
              {v.modele} ({v.immat})
            </option>
          ))}
        </select>
        <button
          onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
        >
          {chartType === "line" ? (
            <>
              <BarChart3 size={18} /> Mode Barres
            </>
          ) : (
            <>
              <LineChartIcon size={18} /> Mode Linéaire
            </>
          )}
        </button>
        <div className="flex flex-wrap gap-2 ">
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => setVisibleMetrics((prev) => ({ ...prev, [m.key]: !prev[m.key] }))}
              className={clsx(
                "px-3 py-1 rounded-full text-sm font-medium border transition",
                visibleMetrics[m.key]
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
        >
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* Graphique + Table à exporter */}
      <div ref={exportRef} className="space-y-8">
        {/* Graphique */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
          <Collapsible title={"Graphique"}>
            <ResponsiveContainer width="100%" height={400}>
              {chartType === "line" ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periode" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {visibleMetrics.trajets && (
                    <Line dataKey="trajets" stroke={colors.trajets} name="Trajets" />
                  )}
                  {visibleMetrics.km && <Line dataKey="km" stroke={colors.km} name="Km" />}
                  {visibleMetrics.carburant && (
                    <Line dataKey="carburant" stroke={colors.carburant} name="Carburant (L)" />
                  )}
                  {visibleMetrics.duree && (
                    <Line dataKey="duree" stroke={colors.duree} name="Durée (h)" />
                  )}
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periode" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {visibleMetrics.trajets && (
                    <Bar dataKey="trajets" fill={colors.trajets} name="Trajets" />
                  )}
                  {visibleMetrics.km && <Bar dataKey="km" fill={colors.km} name="Km" />}
                  {visibleMetrics.carburant && (
                    <Bar dataKey="carburant" fill={colors.carburant} name="Carburant (L)" />
                  )}
                  {visibleMetrics.duree && (
                    <Bar dataKey="duree" fill={colors.duree} name="Durée (h)" />
                  )}
                </BarChart>
              )}
            </ResponsiveContainer>
          </Collapsible>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
          <Collapsible title={`Trajets Complets (${filteredTrajets.length})`}>
            <Table
              data={filteredTrajets}
              columns={[
                {
                  key: "conducteur",
                  label: "Conducteur",
                  render: (t) => {
                    const c = conducteurs.find((c) => c.id === t.conducteurId);
                    return c ? `${c.prenom} ${c.nom}` : "-";
                  },
                },
                {
                  key: "vehicule",
                  label: "Véhicule",
                  render: (t) => {
                    const v = vehicules.find((v) => v.id === t.vehiculeId);
                    return v ? `${v.modele} (${v.immat})` : "-";
                  },
                },
                { key: "destination", label: "Destination" },
                { key: "kmDepart", label: "Km départ" },
                { key: "kmArrivee", label: "Km arrivée" },
                { key: "carburant", label: "Carburant (L)" },
                {
                  key: "date",
                  label: "Date",
                  render: (t) => (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"),
                },
              ]}
            />
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
