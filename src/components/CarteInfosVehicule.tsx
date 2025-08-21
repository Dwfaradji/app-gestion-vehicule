import { Vehicule } from "@/types/vehicule";
import { formatDate } from "@/utils/formatDate";
import StatutBadge from "@/components/StatutBadge";
import {
    FaCar,
    FaTachometerAlt,
    FaGasPump,
    FaCogs,
    FaCalendarAlt,
    FaUsers,
    FaRoad
} from "react-icons/fa";

const CarteInfosVehicule = ({ vehicule }: { vehicule: Vehicule }) => (
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
                <p><strong>Statut :</strong> <StatutBadge statut={vehicule.statut} /></p>
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

export default CarteInfosVehicule;