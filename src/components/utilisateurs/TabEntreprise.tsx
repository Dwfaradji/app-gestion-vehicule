"use client";

import React, {useEffect, useState} from "react";
import { Clock, Calendar, Building, Plus } from "lucide-react";
import { Entreprise, Section, Vacances } from "@/types/entreprise";
import { useEntreprises } from "@/context/entrepriseContext";

// ================= Sous-composants =================

function EditableVacances({
                              vacances,
                              onUpdate,
                              onDelete,
                          }: {
    vacances: Vacances;
    onUpdate: (id: number, data: Partial<Vacances>) => Promise<void>;
    onDelete: (id: number) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [desc, setDesc] = useState(vacances.description);
    const [debut, setDebut] = useState(vacances.debut);
    const [fin, setFin] = useState(vacances.fin);
    return (
        <li className="p-2 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center">
            {editing ? (
                <div className="flex gap-2 flex-wrap items-center">
                    <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="input-field" />
                    <input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} className="input-field" />
                    <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="input-field" />
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={async () => {
                            await onUpdate(vacances.id, { description: desc, debut, fin });
                            setEditing(false);
                        }}
                    >
                        💾
                    </button>
                    <button
                        className="btn btn-sm btn-accent"
                        onClick={() => {
                            setDesc(vacances.description);
                            setDebut(vacances.debut);
                            setFin(vacances.fin);
                            setEditing(false);
                        }}
                    >
                        ❌
                    </button>
                </div>
            ) : (
                <>
          <span>
            {vacances.description ? `${vacances.description} : ` : ""}
              {new Date(vacances.debut).toLocaleDateString()} – {new Date(vacances.fin).toLocaleDateString()}
          </span>
                    <div className="flex gap-2">
                        <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}>
                            ✏️
                        </button>
                        <button className="btn btn-sm btn-accent" onClick={() => onDelete(vacances.id)}>
                            🗑️
                        </button>
                    </div>
                </>
            )}
        </li>
    );
}

function EditableHoraire({
                             value,
                             onSave,
                         }: {
    value: { ouverture: string; fermeture: string };
    onSave: (data: { ouverture: string; fermeture: string }) => Promise<void>;
}) {
    const [horaire, setHoraire] = useState(value);

    useEffect(() => {
        setHoraire(value); // sync si le parent change
    }, [value]);

    return (
        <div className="flex flex-wrap gap-3 items-center">
            <input
                type="time"
                value={horaire.ouverture}
                onChange={(e) => setHoraire({ ...horaire, ouverture: e.target.value })}
                className="input-field"
            />
            <span className="text-gray-500 font-medium">–</span>
            <input
                type="time"
                value={horaire.fermeture}
                onChange={(e) => setHoraire({ ...horaire, fermeture: e.target.value })}
                className="input-field"
            />
            <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                    await onSave(horaire);
                }}
            >
                💾 Enregistrer
            </button>
        </div>
    );
}

function EntrepriseInfo({ entreprise, updateEntreprise }: { entreprise: Entreprise; updateEntreprise: (id: number, data: Partial<Entreprise>) => Promise<void> }) {
    const [editingAll, setEditingAll] = useState(false);
    const [formValues, setFormValues] = useState({
        nom: entreprise.nom,
        siret: entreprise.siret,
        ville: entreprise.ville,
        pays: entreprise.pays,
        adresse: entreprise.adresse,
        codePostal: entreprise.codePostal,
        email: entreprise.email,
        telephone: entreprise.telephone,
    });

    const handleChange = (field: string, value: string) => {
        setFormValues({ ...formValues, [field]: value });
    };

    const handleSaveAll = async () => {
        await updateEntreprise(entreprise.id, formValues);
        setEditingAll(false);
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Informations de l’entreprise</h3>
                {!editingAll ? (
                    <button className="btn btn-primary" onClick={() => setEditingAll(true)}>Modifier</button>
                ) : (
                    <div className="flex gap-2">
                        <button className="btn btn-primary" onClick={handleSaveAll}>💾 Enregistrer</button>
                        <button
                            className="btn btn-accent"
                            onClick={() => {
                                setFormValues({
                                    nom: entreprise.nom,
                                    siret: entreprise.siret,
                                    ville: entreprise.ville,
                                    pays: entreprise.pays,
                                    adresse: entreprise.adresse,
                                    codePostal: entreprise.codePostal,
                                    email: entreprise.email,
                                    telephone: entreprise.telephone,
                                });
                                setEditingAll(false);
                            }}
                        >
                            ❌ Annuler
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
                {Object.entries(formValues).map(([field, value]) => (
                    <div key={field} className="flex items-center gap-2 text-sm md:text-base">
                        <span className="font-semibold text-gray-800">{field.charAt(0).toUpperCase() + field.slice(1)} :</span>
                        {editingAll ? (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="input-field"
                            />
                        ) : (
                            <span>{value}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function EditableSection({
                             section,
                             vacances,
                             sectionHoraires,
                             updateSection,
                             updateHoraire,
                             addVacances,
                             updateVacances,
                             deleteVacances,
                             deleteSection,
                         }: {
    section: Section;
    vacances: Vacances[];
    sectionHoraires: { [key: number]: { ouverture: string; fermeture: string } };
    updateSection: (id: number, data: Partial<Section>) => Promise<void>;
    updateHoraire: (id: string, data: number, type: { ouverture: string; fermeture: string }) => Promise<void>;
    addVacances: (data: Partial<Vacances>) => Promise<void>;
    updateVacances: (id: number, data: Partial<Vacances>) => Promise<void>;
    deleteVacances: (id: number) => void;
    deleteSection: (id: number) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [nom, setNom] = useState(section.nom);
    const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });


    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-4 hover:shadow-sm transition">
            {/* Nom */}
            <div className="flex justify-between items-center mb-3">
                {editing ? (
                    <div className="flex gap-2 flex-wrap items-center">
                        <input value={nom} onChange={(e) => setNom(e.target.value)} className="input-field" />
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={async () => {
                                await updateSection(section.id, { nom });
                                setEditing(false);
                            }}
                        >
                            💾
                        </button>
                        <button
                            className="btn btn-sm btn-accent"
                            onClick={() => {
                                setNom(section.nom);
                                setEditing(false);
                            }}
                        >
                            ❌
                        </button>
                    </div>
                ) : (
                    <>
                        <span className="font-semibold text-gray-800 text-lg">{section.nom}</span>
                        <div className="flex gap-2">
                            <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}>
                                ✏️
                            </button>
                            <button className="btn btn-sm btn-accent" onClick={() => deleteSection(section.id)}>
                                🗑️
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Horaires */}
            <EditableHoraire
                value={sectionHoraires[section.id] || section.horaire || { ouverture: "", fermeture: "" }}
                onSave={ async(h) =>  await updateHoraire("section",section.id, h )}
            />

            {/* Vacances */}
            <h5 className="font-medium text-gray-700 mt-3 mb-2 flex items-center gap-2">
                <Calendar size={16} /> Vacances
            </h5>
            <ul className="space-y-2 mb-3">
                {vacances.map((v) => (
                    <EditableVacances key={v.id} vacances={v} onUpdate={updateVacances} onDelete={deleteVacances} />
                ))}
            </ul>

            {/* Ajouter vacances */}
            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Description"
                    value={newVac.description}
                    onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}
                    className="input-field flex-1"
                />
                <input
                    type="date"
                    value={newVac.debut}
                    onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })}
                    className="input-field"
                />
                <input
                    type="date"
                    value={newVac.fin}
                    onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })}
                    className="input-field"
                />
                <button
                    className="btn btn-accent flex items-center gap-2"
                    onClick={async () => {
                        if (!newVac.debut || !newVac.fin) return;
                        await addVacances({ ...newVac, sectionId: section.id });
                        setNewVac({ description: "", debut: "", fin: "" });
                    }}
                >
                    <Plus size={16} /> Ajouter
                </button>
            </div>
        </div>
    );
}

// ================= Composant principal =================

// export default function EntrepriseDashboard() {
//     const {
//         entreprises,
//         sections,
//         vacances,
//         loading,
//         addSection,
//         updateSection,
//         addVacances,
//         updateHoraire,
//         updateEntreprise,
//         updateVacances,
//         deleteVacances,
//         deleteSection,
//     } = useEntreprises();
//
//     const [sectionHoraires, setSectionHoraires] = useState<{ [key: number | "entreprise"]: { ouverture: string; fermeture: string } }>({});
//     const [newSection, setNewSection] = useState<Partial<Section>>({ nom: "" });
//
//     const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });
//
//     if (loading) return <div className="text-center text-gray-500 mt-10 animate-pulse">Chargement...</div>;
//
//     const entreprisePrincipale = entreprises[0] || null;
//
//     return (
//         <div className="p-6 space-y-10 min-h-screen">
//             {/* Entreprise Principale */}
//             <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
//                 <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
//                     <Building size={24} /> Entreprise principale
//                 </h2>
//                 {entreprisePrincipale ? (
//                     <>
//                         <EntrepriseInfo entreprise={entreprisePrincipale} updateEntreprise={updateEntreprise} />
//
//
//                         <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
//                             <Clock size={18} /> Horaires
//                         </h4>
//                         <EditableHoraire
//                             value={sectionHoraires["entreprise"] || entreprisePrincipale.horaire || { ouverture: "", fermeture: "" }}
//                             onSave={(h) => updateHoraire(entreprisePrincipale.id, h, "entreprise")}
//                         />
//
//                         <h4 className="font-semibold text-gray-700 flex items-center gap-2 mt-8">
//                             <Calendar size={18} /> Vacances
//                         </h4>
//                         <ul className="space-y-2 mt-3">
//                             {vacances.filter((v) => v.entrepriseId === entreprisePrincipale.id).map((v) => (
//                                 <EditableVacances key={v.id} vacances={v} onUpdate={updateVacances} onDelete={deleteVacances} />
//                             ))}
//                         </ul>
//
//                         {/* Ajouter vacances entreprise */}
//                         <div className="flex flex-wrap gap-3">
//                             <input
//                                 type="text"
//                                 placeholder="Description"
//                                 value={newVac.description}
//                                 onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}
//                                 className="input-field flex-1"
//                             />
//                             <input
//                                 type="date"
//                                 value={newVac.debut}
//                                 onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })}
//                                 className="input-field"
//                             />
//                             <input
//                                 type="date"
//                                 value={newVac.fin}
//                                 onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })}
//                                 className="input-field"
//                             />
//                             <button
//                                 className="btn btn-accent flex items-center gap-2"
//                                 onClick={async () => {
//                                     if (!newVac.debut || !newVac.fin) return;
//                                     await addVacances({ ...newVac, entrepriseId: entreprisePrincipale.id });
//                                     setNewVac({ description: "", debut: "", fin: "" });
//                                 }}
//                             >
//                                 <Plus size={16} /> Ajouter
//                             </button>
//                         </div>
//                     </>
//                 ) : (
//                     <p className="text-gray-600 mb-4">Aucune entreprise n’est encore enregistrée.</p>
//                 )}
//             </section>
//
//             {/* Sections */}
//             {entreprisePrincipale && (
//                 <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
//                     <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
//                         <Building size={20} /> Sections / Annexes
//                     </h3>
//
//                     {sections.map((s) => (
//                         <EditableSection
//                             key={s.id}
//                             section={s}
//                             vacances={vacances.filter((v) => v.sectionId === s.id)}
//                             sectionHoraires={sectionHoraires}
//                             updateSection={updateSection}
//                             updateHoraire={updateHoraire}
//                             addVacances={addVacances}
//                             updateVacances={updateVacances}
//                             deleteVacances={deleteVacances}
//                             deleteSection={deleteSection}
//                         />
//                     ))}
//
//                     {/* Ajouter nouvelle section */}
//                     <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
//                         <input
//                             type="text"
//                             placeholder="Nom"
//                             value={newSection.nom || ""}
//                             onChange={(e) => setNewSection({ ...newSection, nom: e.target.value })}
//                             className="input-field"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Ville"
//                             value={newSection.ville || ""}
//                             onChange={(e) => setNewSection({ ...newSection, ville: e.target.value })}
//                             className="input-field"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Email"
//                             value={newSection.email || ""}
//                             onChange={(e) => setNewSection({ ...newSection, email: e.target.value })}
//                             className="input-field"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Téléphone"
//                             value={newSection.telephone || ""}
//                             onChange={(e) => setNewSection({ ...newSection, telephone: e.target.value })}
//                             className="input-field"
//                         />
//                     </div>
//                     <button
//                         className="btn btn-accent mt-3 flex items-center gap-2"
//                         onClick={async () => {
//                             if (!newSection.nom || !entreprisePrincipale) return;
//                             const added = await addSection({ ...newSection, entrepriseId: entreprisePrincipale.id });
//                             if (added) setNewSection({ nom: "", ville: "", email: "", telephone: "" });
//                         }}
//                     >
//                         <Plus size={16} /> Ajouter une section
//                     </button>
//                 </section>
//             )}
//         </div>
//     );
// }

export default function EntrepriseDashboard() {
    const {
        entreprises,
        sections,
        vacances,
        loading,
        addEntreprise,
        addSection,
        updateSection,
        addVacances,
        updateHoraire,
        updateEntreprise,
        updateVacances,
        deleteVacances,
        deleteSection,
    } = useEntreprises();

    const [sectionHoraires, setSectionHoraires] = useState<{ [key: number | "entreprise"]: { ouverture: string; fermeture: string } }>({});
    const [newSection, setNewSection] = useState<Partial<Section>>({ nom: "" });
    const [newEntreprise, setNewEntreprise] = useState<Partial<Entreprise>>({});
    const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });

    if (loading) return <div className="text-center text-gray-500 mt-10 animate-pulse">Chargement...</div>;

    const entreprisePrincipale = entreprises[0] || null;

    return (
        <div className="p-6 space-y-10 min-h-screen">
            {/* Entreprise Principale ou Formulaire */}
            <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                    <Building size={24} /> Entreprise principale
                </h2>

                {entreprisePrincipale ? (
                    <>
                        <EntrepriseInfo entreprise={entreprisePrincipale} updateEntreprise={updateEntreprise} />

                        <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                            <Clock size={18} /> Horaires
                        </h4>
                        <EditableHoraire
                            value={sectionHoraires["entreprise"] || entreprisePrincipale.horaire || { ouverture: "", fermeture: "" }}
                            onSave={(h) => updateHoraire("entreprise",entreprisePrincipale.id, h, )}
                        />

                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mt-8">
                            <Calendar size={18} /> Vacances
                        </h4>
                        <ul className="space-y-2 mt-3">
                            {vacances.filter((v) => v.entrepriseId === entreprisePrincipale.id).map((v) => (
                                <EditableVacances key={v.id} vacances={v} onUpdate={updateVacances} onDelete={deleteVacances} />
                            ))}
                        </ul>

                        {/* Ajouter vacances entreprise */}
                        <div className="flex flex-wrap gap-3">
                            <input
                                type="text"
                                placeholder="Description"
                                value={newVac.description}
                                onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}
                                className="input-field flex-1"
                            />
                            <input
                                type="date"
                                value={newVac.debut}
                                onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="date"
                                value={newVac.fin}
                                onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })}
                                className="input-field"
                            />
                            <button
                                className="btn btn-accent flex items-center gap-2"
                                onClick={async () => {
                                    if (!newVac.debut || !newVac.fin) return;
                                    await addVacances({ ...newVac, entrepriseId: entreprisePrincipale.id });
                                    setNewVac({ description: "", debut: "", fin: "" });
                                }}
                            >
                                <Plus size={16} /> Ajouter
                            </button>
                        </div>
                    </>
                ) : (
                    // Formulaire création entreprise
                    <form
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!newEntreprise.nom) return;
                            await addEntreprise(newEntreprise);
                            setNewEntreprise({});
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Nom de l'entreprise"
                            value={newEntreprise.nom || ""}
                            onChange={(e) => setNewEntreprise({ ...newEntreprise, nom: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Ville"
                            value={newEntreprise.ville || ""}
                            onChange={(e) => setNewEntreprise({ ...newEntreprise, ville: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={newEntreprise.email || ""}
                            onChange={(e) => setNewEntreprise({ ...newEntreprise, email: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Téléphone"
                            value={newEntreprise.telephone || ""}
                            onChange={(e) => setNewEntreprise({ ...newEntreprise, telephone: e.target.value })}
                            className="input-field"
                        />
                        <button type="submit" className="btn btn-accent mt-2 flex items-center gap-2">
                            <Plus size={16} /> Ajouter l'entreprise
                        </button>
                    </form>
                )}
            </section>

            {/* Sections */}
            {entreprisePrincipale && (
                <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
                        <Building size={20} /> Sections / Annexes
                    </h3>

                    {sections.map((s) => (
                        <EditableSection
                            key={s.id}
                            section={s}
                            vacances={vacances.filter((v) => v.sectionId === s.id)}
                            sectionHoraires={sectionHoraires}
                            updateSection={updateSection}
                            updateHoraire={updateHoraire}
                            addVacances={addVacances}
                            updateVacances={updateVacances}
                            deleteVacances={deleteVacances}
                            deleteSection={deleteSection}
                        />
                    ))}

                    {/* Ajouter nouvelle section */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newSection.nom || ""}
                            onChange={(e) => setNewSection({ ...newSection, nom: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Ville"
                            value={newSection.ville || ""}
                            onChange={(e) => setNewSection({ ...newSection, ville: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={newSection.email || ""}
                            onChange={(e) => setNewSection({ ...newSection, email: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Téléphone"
                            value={newSection.telephone || ""}
                            onChange={(e) => setNewSection({ ...newSection, telephone: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <button
                        className="btn btn-accent mt-3 flex items-center gap-2"
                        onClick={async () => {
                            if (!newSection.nom || !entreprisePrincipale) return;
                            const added = await addSection({ ...newSection, entrepriseId: entreprisePrincipale.id });
                            if (added) setNewSection({ nom: "", ville: "", email: "", telephone: "" });
                        }}
                    >
                        <Plus size={16} /> Ajouter une section
                    </button>
                </section>
            )}
        </div>
    );
}