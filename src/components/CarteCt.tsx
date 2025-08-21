import { formatDate } from "@/utils/formatDate";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CarteCT = ({ ctValidite }: { ctValidite: string }) => {
    const isValid = new Date(ctValidite) > new Date();

    return (
        <div className="w-60 rounded-xl bg-white shadow-md border-l-8 border-blue-500 p-4 relative font-sans">
            {/* Bande diagonale pour effet coupon */}
            <div className="absolute top-0 right-0 h-full w-4 bg-gray-100 rounded-tr-xl rounded-br-xl"></div>

            <h2 className="text-lg font-bold mb-2 text-gray-800">Contrôle Technique</h2>

            <p className="text-sm text-gray-600 mb-2">
                Validité : <strong className="text-gray-900">{formatDate(ctValidite)}</strong>
            </p>

            <div className="flex items-center gap-2 mt-3">
                {isValid ? (
                    <FaCheckCircle className="text-green-600" />
                ) : (
                    <FaTimesCircle className="text-red-600" />
                )}
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                    {isValid ? "CT valide" : "CT expiré"}
                </span>
            </div>

            {/* Petit footer imitation coupon */}
            <div className="mt-4 text-[10px] text-gray-400 border-t border-dashed border-gray-300 pt-2">
                Véhicule conforme aux normes françaises
            </div>
        </div>
    );
};

export default CarteCT;