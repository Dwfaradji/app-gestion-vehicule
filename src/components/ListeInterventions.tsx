import {useMemo} from "react";
import {Item} from "@/types/vehicule";

const ListeItems = ({ items, activeTab, handleDelete }: any) => {
    const filtered = useMemo(() => items.filter((i: Item) => i.type === activeTab), [items, activeTab]);
    return (
        <ul className="space-y-3">
            {filtered.map((i: Item, idx: number) => (
                <li key={idx} className="rounded-xl bg-gray-50 p-3 shadow-sm flex justify-between items-start">
                    <div>
                        <p className="font-medium">{i.reparations} – {i.km} {activeTab==="Dépenses"?"€":"km"}</p>
                        <p className="text-sm text-gray-600">Date : {i.date} | Prestataire : {i.prestataire}</p>
                        {i.note && <p className="text-sm italic text-gray-500">Note : {i.note}</p>}
                    </div>
                    <button onClick={() => handleDelete(idx)} className="text-red-600 text-xs hover:underline">Supprimer</button>
                </li>
            ))}
        </ul>
    );
};

export default ListeItems;