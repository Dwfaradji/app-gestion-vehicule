import { Item } from "@/types/entretien";
import {formatDate} from "@/utils/formatDate";

interface ListeItemsProps {
    items: Item[];
    activeTab: string;
    handleDelete: (id: number ) => void;
}

const ListeItems = ({ items, activeTab, handleDelete }: ListeItemsProps) => {
    // 🔹 Filtrage directement
    const filtered = items.filter((i) => i.categorie === activeTab);
    return (
        <ul className="space-y-3">
            {filtered.map((i) => (
                <li
                    key={i.id}
                    className="rounded-xl bg-gray-50 p-3 shadow-sm flex justify-between items-start"
                >
                    <div>
                        {activeTab === "Dépenses" ? (
                            <p className="font-medium">
                                {i.reparation || i.montant} – {formatDate(i.date) } €
                            </p>
                        ) : (
                            <p className="font-medium">
                                {i.reparation} – {i.km} km
                            </p>
                        )}

                        <p className="text-sm text-gray-600">
                            Date : {formatDate(i.date) } | Intervenant : {i.intervenant}
                        </p>

                        {i.note && (
                            <p className="text-sm italic text-gray-500">
                                Note : {i.note}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            if (i.id !== undefined) handleDelete(i.id);
                        }}
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