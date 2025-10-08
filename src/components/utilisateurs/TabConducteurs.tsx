"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTrajets } from "@/context/trajetsContext";
import Table from "@/components/ui/Table";
import ActionButtons from "@/components/ui/ActionButtons";
import { ConfirmAction } from "@/types/actions";
import FormField from "@/components/ui/FormField";

interface TabConducteursProps {
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabConducteurs({ setConfirmAction }: TabConducteursProps) {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [loading, setLoading] = useState(false);
    const { conducteurs } = useTrajets();

    const handleAddConducteur = async () => {
        if (!nom || !prenom) return alert("Nom et prénom requis");

        setLoading(true);
        try {
            setConfirmAction({ type: "ajouter-conducteur", target: { nom, prenom } });
            setNom("");
            setPrenom("");
        } catch (error) {
            console.error(error);
            alert("Impossible d’ajouter le conducteur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Gestion des conducteurs</h2>

            {/* Formulaire ajout */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
                <div className="flex-1">
                    <FormField
                        label="Nom"
                        type="text"
                        value={nom}
                        onChange={(val) => setNom(val)}
                        error={!nom ? "Champ requis" : undefined}
                    />
                </div>

                <div className="flex-1">
                    <FormField
                        label="Prénom"
                        type="text"
                        value={prenom}
                        onChange={(val) => setPrenom(val)}
                        error={!prenom ? "Champ requis" : undefined}
                    />

                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleAddConducteur}
                        disabled={loading || !nom || !prenom}
                        className={`bg-blue-600 text-white px-5 py-2 rounded-xl font-medium shadow-sm transition-all ${
                            loading || !nom || !prenom
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-blue-700 hover:scale-[1.02]"
                        }`}
                    >
                        {loading ? "Ajout..." : "Ajouter"}
                    </button>
                </div>
            </div>
            {/* Table réutilisable */}
            <Table
                data={conducteurs}
                columns={[
                    { key: "nom", label: "Nom" },
                    { key: "prenom", label: "Prénom" },
                    { key: "code", label: "Code", render: (c) => <span className="font-mono">{c.code}</span> },
                    {
                        key: "actions",
                        label: "Actions",
                        render: (c) => (
                            <ActionButtons
                                row={c}
                                buttons={[
                                    {
                                        icon: "Trash2",
                                        color: "red",
                                        onClick: () =>
                                            setConfirmAction({
                                                type: "supprimer-conducteur",
                                                target: c,
                                            }),
                                        tooltip: "Supprimer le conducteur",
                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
}