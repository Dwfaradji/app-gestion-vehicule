import React, { useState } from "react";
import { Horaire } from "@/types/entreprise";
import { useEntreprises } from "@/context/entrepriseContext";
import { Edit3, Save, X } from "lucide-react";

interface EditableHoraireProps {
    value: Horaire;
}

export function EditableHoraire({ value }: EditableHoraireProps) {
    const [horaire, setHoraire] = useState<Horaire>({
        id: value.id,
        ouverture: value.ouverture || "",
        fermeture: value.fermeture || "",
        entrepriseId: value.entrepriseId ?? null,
        sectionId: value.sectionId ?? null,
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const { addHoraire, updateHoraire } = useEntreprises();

    const handleSave = async () => {
        if (!horaire.ouverture || !horaire.fermeture) {
            setMessage("⛔ Les deux horaires sont obligatoires.");
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const result = horaire.id
                ? await updateHoraire(horaire.id, { ...horaire })
                : await addHoraire({ ...horaire });
            if (result?.id) setHoraire((prev) => ({ ...prev, id: result.id }));
            setMessage(horaire.id ? "✅ Horaire mis à jour !" : "✅ Horaire créé !");
            setEditing(false);
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setHoraire({
            id: value.id,
            ouverture: value.ouverture || "",
            fermeture: value.fermeture || "",
            entrepriseId: value.entrepriseId ?? null,
            sectionId: value.sectionId ?? null,
        });
        setEditing(false);
        setMessage(null);
    };

    return (
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                {editing ? (
                        <div className={"flex gap-2 w-full md:w-auto"}>
                        <input
                            type="time"
                            value={horaire.ouverture}
                            onChange={(e) => setHoraire({ ...horaire, ouverture: e.target.value })}
                            className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm bg-white transition"
                        />
                        <span className="text-gray-500 font-medium select-none">–</span>
                        <input
                            type="time"
                            value={horaire.fermeture}
                            onChange={(e) => setHoraire({ ...horaire, fermeture: e.target.value })}
                            className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm bg-white transition"
                        />
                        </div>
                ) : (
                    <p
                        className="text-gray-700 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
                        // onClick={() => setEditing(true)}
                        title="Cliquer pour modifier"
                    >
                        {horaire.ouverture && horaire.fermeture
                            ? `${horaire.ouverture} – ${horaire.fermeture}`
                            : "Aucun horaire"}
                    </p>
                )}

                <div className="flex gap-2">
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            title="Modifier l'horaire"
                        >
                            <Edit3 size={16} />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                <X size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {message && (
                <p
                    className={`text-sm mt-1 ${
                        message.startsWith("❌") ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}