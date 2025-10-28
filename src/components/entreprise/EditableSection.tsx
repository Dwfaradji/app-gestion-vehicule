import { Section, Vacances, Horaire } from "@/types/entreprise";
import React, { useState } from "react";
import { Calendar, Plus, Edit3, Save, X, Trash2 } from "lucide-react";
import { EditableHoraire } from "@/components/entreprise/EditableHoraire";
import EditableVacances from "@/components/entreprise/EditableVacances";
import Collapsible from "@/components/ui/Collapsible";

interface EditableSectionProps {
    section: Section;
    vacances: Vacances[];
    sectionHoraires: Record<number, { ouverture: string; fermeture: string }>;
    updateSection: (id: number, data: Partial<Section>) => Promise<void>;
    updateHoraire: (id: number, data: Partial<Horaire>) => Promise<void>;
    addVacances: (data: Partial<Vacances>) => Promise<Vacances>;
    updateVacances: (id: number, data: Partial<Vacances>) => Promise<void>;
    deleteVacances: (id: number) => void;
    deleteSection: (id: number) => void;
}

export default function EditableSection({
                                            section,
                                            vacances,
                                            updateSection,
                                            addVacances,
                                            updateVacances,
                                            deleteVacances,
                                            deleteSection,
                                        }: EditableSectionProps) {
    const [editing, setEditing] = useState(false);
    const [nom, setNom] = useState(section.nom);
    const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });

    const handleCancel = () => {
        setNom(section.nom);
        setEditing(false);
    };

    const handleSave = async () => {
        await updateSection(section.id, { nom });
        setEditing(false);
    };

    const handleAddVac = async () => {
        if (!newVac.debut || !newVac.fin) return;
        await addVacances({ ...newVac, sectionId: section.id });
        setNewVac({ description: "", debut: "", fin: "" });
    };

    return (
        <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 mb-4">
            {/* ==== Titre de la section ==== */}
            <div className="flex justify-between items-center mb-4">
                {editing ? (
                    <>
                        <div className={"flex gap-2 w-full md:w-auto"}>
                            <input
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="Nom de la section"
                                className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm text-gray-800"
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
                    <>
                        <Collapsible title={section.nom} defaultOpen={false}   >
                        <ul>

                            {/*<span className="font-semibold text-gray-900 text-lg">{section.nom}</span>*/}

                            <li className=" text-gray-900 text-sm">{section.email}</li>
                            <li className=" text-gray-900 text-sm">{section.telephone}</li>
                            <li className=" text-gray-900 text-sm">{section.adresse}</li>
                            <li className=" text-gray-900 text-sm">{section.ville}</li>
                            <li className=" text-gray-900 text-sm">{section.codePostal}</li>
                            <li className=" text-gray-900 text-sm">{section.pays}</li>
                        </ul>
                    </Collapsible>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={() => deleteSection(section.id)}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ==== Horaires ==== */}
            <EditableHoraire
                value={{
                    id: section.horaire?.id ?? null,
                    ouverture: section.horaire?.ouverture ?? "",
                    fermeture: section.horaire?.fermeture ?? "",
                    sectionId: section.id,
                    entrepriseId: section.horaire?.entrepriseId ?? null,
                }}
            />

            {/* ==== Vacances ==== */}
            <h5 className="font-medium text-gray-700 mt-5 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" /> Vacances
            </h5>

            <ul className="space-y-2 mb-3">
                {vacances.length > 0 ? (
                    vacances.map((v) => (
                        <EditableVacances
                            key={v.id}
                            vacances={v}
                            onUpdate={updateVacances}
                            onDelete={deleteVacances}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm italic">Aucune période de vacances</p>
                )}
            </ul>

            {/* ==== Ajouter des vacances ==== */}
            <div className="flex flex-wrap gap-3 mt-3 items-end">
                <div className="flex flex-col flex-1 min-w-[120px]">
                    <label className="text-sm text-gray-600 mb-1">Description</label>
                    <input
                        type="text"
                        placeholder="Ex: Fermeture annuelle"
                        value={newVac.description}
                        onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}
                        className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Début</label>
                    <input
                        type="date"
                        value={newVac.debut}
                        onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })}
                        className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Fin</label>
                    <input
                        type="date"
                        value={newVac.fin}
                        onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })}
                        className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition"
                    />
                </div>

                <button
                    onClick={handleAddVac}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}