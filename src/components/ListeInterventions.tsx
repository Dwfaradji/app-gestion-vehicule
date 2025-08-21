import { useMemo } from "react";
import { Depense } from "@/types/depenses";


const ListeItems = ({ items, activeTab, handleDelete }: any) => {
    const filtered = useMemo(
        () => items.filter((i: Depense) => i.categorie === activeTab),

        [items, activeTab]
    );
    console.log(items,"items")
    return (
        <ul className="space-y-3">
            {filtered.map((i: Depense, idx: number) => (
                <li
                    key={idx}
                    className="rounded-xl bg-gray-50 p-3 shadow-sm flex justify-between items-start"
                >
                    <div>
                        {/* 🔹 Affichage dynamique en fonction de l'onglet */}
                        {activeTab === "Dépenses" ? (
                            <p className="font-medium">
                                toto
                                {i.reparation || i.km} – {i.date} €
                            </p>
                        ) : (
                            <p className="font-medium">
                                {i.reparation} – {i.km} km
                            </p>
                        )}

                        <p className="text-sm text-gray-600">
                            Date : {i.date} | Prestataire : {i.prestataire}
                        </p>

                        {i.note && (
                            <p className="text-sm italic text-gray-500">
                                Note : {i.note}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => handleDelete(i.id)}
                        className="text-red-600 text-xs hover:underline"
                    >
                        Supprimer
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ListeItems;