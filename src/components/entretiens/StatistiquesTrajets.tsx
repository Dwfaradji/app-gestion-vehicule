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
import { Car, MapPin, Droplet, Clock, BarChart3, LineChartIcon, Download } from "lucide-react";
import clsx from "clsx";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import Cards from "@/components/ui/Cards";

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

  const totalTrajets = filteredTrajets.length;
  const totalKm = filteredTrajets.reduce(
    (acc, t) => acc + ((t.kmArrivee ?? 0) - (t.kmDepart ?? 0)),
    0,
  );
  const totalCarburant = filteredTrajets.reduce((acc, t) => acc + (t.carburant ?? 0), 0);
  const totalMinutes = filteredTrajets.reduce((acc, t) => {
    if (!t.heureDepart || !t.heureArrivee) return acc;
    const [hdH, hdM] = t.heureDepart.split(":").map(Number);
    const [haH, haM] = t.heureArrivee.split(":").map(Number);
    let diff = haH * 60 + haM - (hdH * 60 + hdM);
    if (diff < 0) diff += 24 * 60;
    return acc + diff;
  }, 0);
  const dureeTotale = `${Math.floor(totalMinutes / 60)}h ${String(totalMinutes % 60).padStart(2, "0")}m`;

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

  // 🧱 Cards résumé
  const cards = [
    { label: "Trajets", value: totalTrajets, icon: MapPin, color: "blue" },
    { label: "Km parcourus", value: `${totalKm.toLocaleString()} km`, icon: Car, color: "green" },
    { label: "Durée totale", value: dureeTotale, icon: Clock, color: "yellow" },
    { label: "Carburant", value: `${totalCarburant.toFixed(1)} L`, icon: Droplet, color: "red" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">📈 Statistiques des trajets</h1>

      {/* Archivage */}
      <div className="flex flex-wrap gap-2">
        <ArchiveButton
          endpoint="/api/archive?type=vehicules"
          filename="vehicules.pdf"
          label="Exporter les véhicules"
        />
        <ArchiveButton
          endpoint="/api/archive?type=trajets"
          filename="trajets.pdf"
          label="Exporter les trajets"
        />
        <ArchiveButton
          endpoint="/api/archive?type=depenses"
          filename="depenses.pdf"
          label="Exporter les dépenses"
        />
      </div>

      {/* Cards */}
      <Cards cards={cards} />
      {/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">*/}
      {/*    {cards.map((card, i) => {*/}
      {/*        const Icon = card.icon;*/}
      {/*        return (*/}
      {/*            <div key={i} className={clsx(*/}
      {/*                "flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200",*/}
      {/*                `text-${card.color}-700`*/}
      {/*            )}>*/}
      {/*                <div className={clsx(`bg-${card.color}-100 p-3 rounded-full flex items-center justify-center`)}>*/}
      {/*                    <Icon className="w-6 h-6" />*/}
      {/*                </div>*/}
      {/*                <div>*/}
      {/*                    <p className="text-sm text-gray-500">{card.label}</p>*/}
      {/*                    <p className="text-lg font-semibold">{card.value}</p>*/}
      {/*                </div>*/}
      {/*            </div>*/}
      {/*        );*/}
      {/*    })}*/}
      {/*</div>*/}

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
        <div className="flex flex-wrap gap-2 ml-auto">
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
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Trajets complets ({filteredTrajets.length})
          </h2>
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
        </div>
      </div>
    </div>
  );
}
