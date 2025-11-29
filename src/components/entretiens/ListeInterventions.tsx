import type { Item } from "@/types/entretien";
import { formatDate } from "@/utils/formatDate";
import { Trash2 } from "lucide-react";
import React from "react";
import { normalizeCat } from "@/utils/normalizeCat";

interface ListeItemsProps {
  items: Item[];
  activeTab: string;
  handleDelete: (id: number) => void;
}

const ListeItems = ({ items, activeTab, handleDelete }: ListeItemsProps) => {
  // 🔹 Filtrage directement
  const filtered = items.filter(
    (i) => normalizeCat(i.categorie, true) === normalizeCat(activeTab, true),
  );
  return (
    <ul className="space-y-3 mt-10">
      {filtered.map((i) => (
        <li
          key={i.id}
          className="rounded-xl bg-gray-50 p-3 shadow-sm flex justify-between items-start"
        >
          <div>
            {activeTab === "Dépenses" ? (
              <p className="font-medium">
                {i.reparation || i.montant} – {formatDate(i.date)} €
              </p>
            ) : (
              <p className="font-medium">
                {i.reparation} – {i.km} km
              </p>
            )}

            <p className="text-sm text-gray-600">
              Date : {formatDate(i.date)} | Intervenant : {i.intervenant}
            </p>

            {i.note && <p className="text-sm italic text-gray-500">Note : {i.note}</p>}
            {i.montant && <p className="text-sm italic text-gray-500">Montant : {i.montant} €</p>}
          </div>

          <button
            onClick={() => {
              if (i.id !== undefined) handleDelete(i.id);
            }}
            className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ListeItems;
