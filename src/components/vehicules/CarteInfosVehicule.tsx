"use client";

import {Vehicule, VehiculeStatus} from "@/types/vehicule";
import { formatDate } from "@/utils/formatDate";
import {
    FaCar,
    FaTachometerAlt,
    FaGasPump,
    FaCogs,
    FaCalendarAlt,
    FaUsers,
    FaRoad
} from "react-icons/fa";
import { useVehicules } from "@/context/vehiculesContext";
import { useState } from "react";

const CarteInfosVehicule = ({ vehicule }: { vehicule: Vehicule }) => {
    const { updateVehicule } = useVehicules();
    const [statut, setStatut] = useState<VehiculeStatus>(vehicule.statut);


    const handleChangeStatut = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatut = e.target.value as VehiculeStatus; // ✅ cast
        setStatut(newStatut);

        try {
            await updateVehicule({ id: vehicule.id, statut: newStatut });
        } catch (err) {
            console.error("Erreur mise à jour statut:", err);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Section principale */}
            <div className="flex-1 rounded-2xl bg-white shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                    <FaCar size={24} /> Infos Générales
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p><strong>Immat :</strong> {vehicule.immat}</p>
                    <p><strong>Constructeur :</strong> {vehicule.constructeur}</p>
                    <p><strong>Modèle :</strong> {vehicule.modele}</p>
                    <p className="flex items-center gap-2"><FaTachometerAlt className="text-gray-500"/> <strong>Kilométrage :</strong> {vehicule.km} km</p>
                    <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500"/> <strong>Type :</strong> {vehicule.type}</p>

                    {/* 🔹 Select modifiable pour le statut */}
                    <div className="flex items-center gap-3">
                        <strong className="text-gray-700">Statut :</strong>

                        <select
                            value={statut}
                            onChange={handleChangeStatut}
                            className={`
      px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm
      border focus:outline-none transition
      ${
                                statut === "Disponible"
                                    ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                    : statut === "Maintenance"
                                        ? "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                                        : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                            }
    `}
                        >
                            <option value="Disponible">Disponible</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Incident">Incident</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Section moteur & énergie */}
            <div className="flex-1 rounded-2xl bg-white shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-600">
                    <FaCogs size={24} /> Moteur & Energie
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p className="flex items-center gap-2"><FaCogs className="text-gray-500"/> <strong>Motorisation :</strong> {vehicule.motorisation}</p>
                    <p className="flex items-center gap-2"><FaGasPump className="text-gray-500"/> <strong>Energie :</strong> {vehicule.energie}</p>
                    <p className="flex items-center gap-2"><FaUsers className="text-gray-500"/> <strong>Places :</strong> {vehicule.places}</p>
                    <p className="flex items-center gap-2"><FaRoad className="text-gray-500"/> <strong>VIM :</strong> {vehicule.vim}</p>
                </div>
            </div>

            {/* Section révisions & dates */}
            <div className="flex-1 rounded-2xl bg-white shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-600">
                    <FaCalendarAlt size={24} /> Entretien & Révisions
                </h2>
                <div className="space-y-3 text-gray-700">
                    <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500"/> <strong>Prochaine Révision :</strong> {formatDate(vehicule.prochaineRevision)}</p>
                    <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500"/> <strong>Date d'entretien :</strong> {formatDate(vehicule.dateEntretien)}</p>
                </div>
            </div>
        </div>
    );
};

export default CarteInfosVehicule;