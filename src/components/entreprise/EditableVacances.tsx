import { Vacances } from "@/types/entreprise";
import React, { useState } from "react";
import { Edit3, Save, X, Trash2 } from "lucide-react";

export default function EditableVacances({
                                             vacances,
                                             onUpdate,
                                             onDelete,
                                         }: {
    vacances: Vacances;
    onUpdate: (id: number, data: Partial<Vacances>) => Promise<void>;
    onDelete: (id: number) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [desc, setDesc] = useState(vacances.description ?? "");
    const [debut, setDebut] = useState(vacances.debut ?? "");
    const [fin, setFin] = useState(vacances.fin ?? "");

    const handleCancel = () => {
        setDesc(vacances.description ?? "");
        setDebut(vacances.debut ?? "");
        setFin(vacances.fin ?? "");
        setEditing(false);
    };

    const handleSave = async () => {
        await onUpdate(vacances.id, { description: desc, debut, fin });
        setEditing(false);
    };

    return (
        <li className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-2">
            {editing ? (
                < >
                    <div className={"flex  gap-2 w-full md:w-auto"}>
                    <input
                        type="text"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Description"
                        className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition w-full md:w-auto"
                    />
                    <input
                        type="date"
                        value={debut}
                        onChange={(e) => setDebut(e.target.value)}
                        className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition"
                    />
                    <input
                        type="date"
                        value={fin}
                        onChange={(e) => setFin(e.target.value)}
                        className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition"
                    />

                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                        >
                            <Save size={16} />
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-wrap justify-between items-center w-full">
          <span className="text-gray-700">
            {desc ? `${desc} :  ` : ""}
              {debut && fin
                  ? `${new Date(debut).toLocaleDateString()} – ${new Date(fin).toLocaleDateString()}`
                  : "Dates non renseignées"}
          </span>
                    <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            onClick={() => setEditing(true)}
                        >
                            <Edit3 size={16} />
                        </button>
                        <button
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                            onClick={() => onDelete(vacances.id)}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
}