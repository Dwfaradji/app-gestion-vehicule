'use client';

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Vehicule } from "@/types/vehicule";
import { Conducteur, Trajet } from "@/types/trajet";
import { useRouter } from "next/navigation";

interface VehiculesTableProps {
    vehicules: Vehicule[];
    trajets: Trajet[];
    conducteurs: Conducteur[];
    calculerDuree: (heureDepart?: string, heureArrivee?: string) => string | null;
    handleUpdateKmVehicule: (vehiculeId: number, kmArrivee?: number) => void;
    loadingVehiculeId: number | null;
}

export default function VehiculesTableAccueil({
                                                  vehicules,
                                                  trajets,
                                                  conducteurs,
                                                  calculerDuree,
                                                  handleUpdateKmVehicule,
                                                  loadingVehiculeId
                                              }: VehiculesTableProps) {
    const [search, setSearch] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [heureStart, setHeureStart] = useState("");
    const [heureEnd, setHeureEnd] = useState("");
    const [selectedVehicule, setSelectedVehicule] = useState("");
    const [selectedConducteur, setSelectedConducteur] = useState("");
    const [disponibleOnly, setDisponibleOnly] = useState(false);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const resetFilters = () => {
        setSearch("");
        setDateStart("");
        setDateEnd("");
        setHeureStart("");
        setHeureEnd("");
        setSelectedVehicule("");
        setSelectedConducteur("");
        setDisponibleOnly(false);
    };

    // Véhicules disponibles
    const vehiculesDisponibles = useMemo(() => {
        return vehicules.filter(v => {
            return !trajets.some(t =>
                t.vehiculeId === v.id &&
                t.conducteurId &&
                !t.heureArrivee // indisponible si pas d'heureArrivee
            );
        });
    }, [vehicules, trajets]);

    // Trajets filtrés
    const filteredTrajets = useMemo(() => {
        const searchLower = search.toLowerCase();

        return trajets
            .filter(t => {
                const vehicule = vehicules.find(v => v.id === t.vehiculeId);
                const conducteur = conducteurs.find(c => c.id === t.conducteurId);

                if (disponibleOnly && vehicule && !vehiculesDisponibles.some(v => v.id === vehicule.id)) {
                    return false;
                }

                const matchesSearch =
                    !search ||
                    vehicule?.modele.toLowerCase().includes(searchLower) ||
                    vehicule?.type.toLowerCase().includes(searchLower) ||
                    vehicule?.immat.toLowerCase().includes(searchLower) ||
                    conducteur?.prenom.toLowerCase().includes(searchLower) ||
                    conducteur?.nom.toLowerCase().includes(searchLower) ||
                    t.destination?.toLowerCase().includes(searchLower) ||
                    t.heureDepart?.toLowerCase().includes(searchLower) ||
                    t.heureArrivee?.toLowerCase().includes(searchLower) ||
                    t.createdAt?.toLowerCase().includes(searchLower);

                const matchesDate =
                    (!dateStart || new Date(t.createdAt) >= new Date(dateStart)) &&
                    (!dateEnd || new Date(t.createdAt) <= new Date(dateEnd));

                // Normaliser les heures
                const heureDepart = t.heureDepart ?? "00:00";
                const heureArrivee = t.heureArrivee ?? "23:59";

                const matchesHeure =
                    (!heureStart || heureDepart >= heureStart) &&
                    (!heureEnd || heureArrivee <= heureEnd);

                const matchesVehicule =
                    !selectedVehicule || vehicule?.id === Number(selectedVehicule);

                const matchesConducteur =
                    !selectedConducteur || conducteur?.id === Number(selectedConducteur);

                return matchesSearch && matchesDate && matchesHeure && matchesVehicule && matchesConducteur;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [
        search, dateStart, dateEnd, heureStart, heureEnd,
        selectedVehicule, selectedConducteur,
        disponibleOnly, trajets, vehicules, conducteurs, vehiculesDisponibles
    ]);

    const totalPages = Math.ceil(filteredTrajets.length / itemsPerPage);
    const paginatedTrajets = filteredTrajets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getEtatTrajet = (t: Trajet) => {
        if (!t.conducteurId)
            return { label: "Aucun conducteur", icon: <span className="text-red-600">✖</span> };
        if (!t.kmDepart || !t.kmArrivee || !t.heureDepart || !t.heureArrivee || !t.destination)
            return { label: "Infos manquantes", icon: <span className="text-yellow-600">⚠</span> };
        return { label: "Complet", icon: <span className="text-green-600">✔</span> };
    };

    return (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-md mt-6 p-4">
            {/* 🔍 Barre de recherche */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher véhicule, conducteur, destination, état..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {search && (
                        <button
                            onClick={() => { setSearch(""); setCurrentPage(1); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-2 items-center">
                    <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                    <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                    <input type="time" value={heureStart} onChange={(e) => setHeureStart(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                    <input type="time" value={heureEnd} onChange={(e) => setHeureEnd(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />

                    <select value={selectedVehicule} onChange={(e) => setSelectedVehicule(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                        <option value="">Tous les véhicules</option>
                        {vehicules.map(v => (
                            <option key={v.id} value={v.id}>{v.type} - {v.modele} ({v.immat})</option>
                        ))}
                    </select>

                    <select value={selectedConducteur} onChange={(e) => setSelectedConducteur(e.target.value)} className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                        <option value="">Tous les conducteurs</option>
                        {conducteurs.map(c => (
                            <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setDisponibleOnly(!disponibleOnly)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${disponibleOnly ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        {disponibleOnly ? "Afficher tous" : "Disponibles"}
                    </button>

                    <button onClick={resetFilters} className="ml-auto px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
                        Réinitialiser
                    </button>
                </div>
            </div>

            {/* 🟢 Véhicules disponibles */}
            <div className="px-4 py-2 bg-gray-50 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Véhicules disponibles ({vehiculesDisponibles.length})</h3>
                <ul className="flex flex-wrap gap-2 text-sm">
                    {vehiculesDisponibles.map(v => (
                        <li key={v.id} className="px-2 py-1 bg-green-100 text-green-800 rounded">
                            {v.type} - {v.modele} ({v.immat})
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tableau des trajets */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        {["Type","Modèle","Énergie","Immatriculation","Km total","Conducteur","Destination","Km départ","Km arrivée","Heure départ","Heure arrivée","Durée", "Date", "État","Actions"].map(t => (
                            <th key={t} className="px-4 py-3 text-left font-semibold tracking-wider">{t}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {paginatedTrajets.map(t => {
                        const vehicule = vehicules.find(v => v.id === t.vehiculeId);
                        const conducteur = conducteurs.find(c => c.id === t.conducteurId);
                        const etat = getEtatTrajet(t);
                        const duree = calculerDuree(t.heureDepart, t.heureArrivee);

                        return (
                            <tr
                                key={t.id}
                                onClick={() => router.push(`/details-trajet/${vehicule?.id}`)}
                                className="cursor-pointer hover:bg-blue-50 transition duration-200 ease-in-out even:bg-gray-50"
                            >
                                <td className="px-4 py-3">{vehicule?.type}</td>
                                <td className="px-4 py-3">{vehicule?.modele}</td>
                                <td className="px-4 py-3">{vehicule?.energie}</td>
                                <td className="px-4 py-3 font-medium">{vehicule?.immat}</td>
                                <td className="px-4 py-3">{vehicule?.km.toLocaleString()} km</td>
                                <td className="px-4 py-3">{conducteur ? `${conducteur.prenom} ${conducteur.nom}` : <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3">{t.destination || <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3">{t.kmDepart ?? <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3">{t.kmArrivee ?? <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3">{t.heureDepart || <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3">{t.heureArrivee || <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3">{duree || <span className="text-gray-400">-</span>}</td>
                                <td className="px-4 py-3">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</td>
                                <td className="px-4 py-3 flex items-center gap-2 font-medium">{etat.icon} <span>{etat.label}</span></td>
                                <td className="px-4 py-3">
                                    {vehicule?.id != null && t.kmArrivee != null && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateKmVehicule(vehicule.id, t.kmArrivee ?? undefined);
                                            }}
                                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                                        >
                                            {loadingVehiculeId === vehicule.id ? "..." : "Mettre à jour km"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span className="px-2">Page {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}