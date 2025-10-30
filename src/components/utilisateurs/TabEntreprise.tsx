// // "use client";
// //
// // import React, { useState } from "react";
// // import { useEntreprises } from "@/context/entrepriseContext";
// // import {Entreprise, Horaire, Section, Vacances} from "@/types/entreprise";
// // import { Building, Calendar, Clock } from "lucide-react";
// // import { EditableHoraire } from "@/components/entreprise/EditableHoraire";
// // import EditableVacances from "@/components/entreprise/EditableVacances";
// // import EditableSection from "@/components/entreprise/EditableSection";
// // import IconButton from "@/components/ui/IconButton";
// // import EditableEntreprise from "@/components/entreprise/EditableEntreprise";
// //
// // export default function EntrepriseDashboard() {
// //     const {
// //         entreprises,
// //         sections,
// //         vacances,
// //         loading,
// //         addEntreprise,
// //         addSection,
// //         updateSection,
// //         addVacances,
// //         addHoraire,
// //         updateHoraire,
// //         updateEntreprise,
// //         updateVacances,
// //         deleteVacances,
// //         deleteSection,
// //     } = useEntreprises();
// //
// //     const [sectionHoraires] = useState<Record<number, { ouverture: string; fermeture: string }>>({});
// //     const [newSection, setNewSection] = useState<Partial<Section>>({ nom: "" });
// //     const [newEntreprise, setNewEntreprise] = useState<Partial<Entreprise>>({});
// //     const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });
// //     const [editing, setEditing] = useState(false);
// //
// //     const [vacancesData, setVacancesData] = useState<Vacances[]>(vacances);
// //
// //
// //     const entreprisePrincipale = entreprises[0] || null;
// //
// //     const [dataHoraire, setDataHoraire] = useState<Partial<Horaire>>({
// //         id: entreprisePrincipale.horaire?.id ?? null,
// //         ouverture: entreprisePrincipale.horaire?.ouverture ?? "",
// //         fermeture: entreprisePrincipale.horaire?.fermeture ?? "",
// //         entrepriseId: entreprisePrincipale.id ?? null,
// //     });
// //
// //
// //     const [dataEntreprise, setDataEntreprise] = useState<Partial<Section>>({
// //         nom: entreprisePrincipale.nom,
// //         email: entreprisePrincipale.email,
// //         telephone: entreprisePrincipale.telephone,
// //         adresse: entreprisePrincipale.adresse,
// //         ville: entreprisePrincipale.ville,
// //         codePostal: entreprisePrincipale.codePostal,
// //         pays: entreprisePrincipale.pays,
// //     });
// //
// //
// //
// //
// //     if (loading)
// //         return <div className="text-center text-gray-500 mt-10 animate-pulse">Chargement...</div>;
// //
// //
// //
// //
// //     const handleSave = async () => {
// //         // Sauvegarde entreprise principale
// //         await updateEntreprise(entreprisePrincipale.id, dataEntreprise);
// //
// //         // Sauvegarde horaire
// //         if (!dataHoraire.id) {
// //             return await addHoraire(dataHoraire);
// //         }
// //         await updateHoraire(dataHoraire.id, dataHoraire);
// //
// //         // // Sauvegarde vacances existantes
// //         for (const vac of vacancesData) {
// //             await updateVacances(vac.id, vac);
// //         }
// //
// //         setEditing(false);
// //     };
// //
// //     const handleAddVac = async () => {
// //         if (!newVac.debut || !newVac.fin) return;
// //
// //         const added = await addVacances({ ...newVac, entrepriseId: entreprisePrincipale.id });
// //         setVacancesData([...vacancesData, added]);
// //         setNewVac({ description: "", debut: "", fin: "" });
// //     };
// //
// //     const handleUpdateVacance = (updated: Vacances) => {
// //         setVacancesData((prev) =>
// //             prev.map((v) => (v.id === updated.id ? updated : v))
// //         );
// //     };
// //
// //
// //     const handleHoraireChange = async (updated: Horaire) => {
// //         setDataHoraire(updated);
// //     };
// //
// //     const handleDeleteVacance = async (id: number) => {
// //       await  deleteVacances(id);
// //         setVacancesData(vacancesData.filter((v) => v.id !== id));
// //     };
// //
// //     const filterVacances= vacancesData.filter((v) => v.entrepriseId === entreprisePrincipale.id);
// //
// //     return (
// //         <div className="p-6 space-y-10 min-h-screen relative">
// //             <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
// //                 <Building size={24} /> Entreprise principale
// //             </h2>
// //
// //             {/* ======== ENTREPRISE PRINCIPALE ======== */}
// //             <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 relative">
// //                 {entreprisePrincipale ? (
// //                     <>
// //                         {/* === Boutons édition === */}
// //                         <div className="absolute top-4 right-6 flex gap-2">
// //                             {!editing ? (
// //                                 <IconButton
// //                                     icon="Edit3"
// //                                     color="blue"
// //                                     tooltip="Modifier les informations"
// //                                     onClick={() => setEditing(true)}
// //                                 />
// //                             ) : (
// //                                 <>
// //                                     <IconButton
// //                                         icon="Save"
// //                                         color="green"
// //                                         tooltip="Enregistrer les modifications"
// //                                         onClick={handleSave}
// //                                     />
// //                                     <IconButton
// //                                         icon="X"
// //                                         color="gray"
// //                                         tooltip="Annuler les modifications"
// //                                         onClick={() => {
// //                                             // annule les modifications locales
// //                                             setEditing(false);
// //                                         }}
// //                                     />
// //                                 </>
// //                             )}
// //                         </div>
// //
// //                         {/* === Informations entreprise === */}
// //                         <EditableEntreprise
// //                             entreprise={entreprisePrincipale}
// //                             updateEntreprise={updateEntreprise}
// //                             editing={editing}
// //                         />
// //
// //                         {/* === Horaires === */}
// //                         <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
// //                             <Clock size={18} /> Horaires
// //                         </h4>
// //                         <EditableHoraire
// //                             value={dataHoraire as Horaire}
// //                             editing={editing}
// //                             onChange={ handleHoraireChange}
// //                         />
// //
// //                         {/* === Vacances === */}
// //                         <h4 className="font-semibold text-gray-700 flex items-center gap-2 mt-8">
// //                             <Calendar size={18} /> Vacances
// //                         </h4>
// //
// //                         <ul className="space-y-2 mb-3">
// //                             {filterVacances.length > 0 ? (
// //                                 filterVacances.map((v) => (
// //                                     <EditableVacances
// //                                         key={v.id}
// //                                         vacances={v}
// //                                         editing={editing}
// //                                         onUpdate={handleUpdateVacance}
// //                                         onDelete={handleDeleteVacance}
// //                                     />
// //                                 ))
// //                             ) : (
// //                                 <p className="text-gray-500 text-sm italic">Aucune période de vacances</p>
// //                             )}
// //                         </ul>
// //
// //
// //
// //                         {/* === Ajouter vacances === */}
// //                         {editing && (
// //                             <div className="flex flex-wrap gap-3 mt-3 items-end">
// //                                 <div className="flex flex-col flex-1 min-w-[120px]">
// //                                     <label className="text-sm text-gray-600 mb-1">Description</label>
// //                                     <input
// //                                         type="text"
// //                                         placeholder="Ex: Fermeture annuelle"
// //                                         value={newVac.description}
// //                                         onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}
// //                                         className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition"
// //                                     />
// //                                 </div>
// //
// //                                 <div className="flex flex-col">
// //                                     <label className="text-sm text-gray-600 mb-1">Début</label>
// //                                     <input
// //                                         type="date"
// //                                         value={newVac.debut}
// //                                         onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })}
// //                                         className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition"
// //                                     />
// //                                 </div>
// //
// //                                 <div className="flex flex-col">
// //                                     <label className="text-sm text-gray-600 mb-1">Fin</label>
// //                                     <input
// //                                         type="date"
// //                                         value={newVac.fin}
// //                                         onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })}
// //                                         className="border-b border-gray-300 focus:border-blue-400 outline-none px-2 py-1 rounded-sm transition"
// //                                     />
// //                                 </div>
// //
// //                                 <IconButton
// //                                     icon="Plus"
// //                                     color="blue"
// //                                     tooltip="Ajouter des vacances"
// //                                     // onClick={async () => {
// //                                     //     if (!newVac.debut || !newVac.fin) return;
// //                                     //     await addVacances({ ...newVac, entrepriseId: entreprisePrincipale.id });
// //                                     //     setNewVac({ description: "", debut: "", fin: "" });
// //                                     // }}
// //                                     onClick={handleAddVac}
// //                                 />
// //                             </div>
// //                         )}
// //                     </>
// //                 ) : (
// //                     // --- Formulaire de création d'entreprise ---
// //                     <form
// //                         className="grid grid-cols-1 md:grid-cols-2 gap-4"
// //                         onSubmit={async (e) => {
// //                             e.preventDefault();
// //                             if (!newEntreprise.nom) return;
// //                             await addEntreprise(newEntreprise);
// //                             setNewEntreprise({});
// //                         }}
// //                     >
// //                         {["nom", "ville", "email", "telephone", "siret", "adresse", "codePostal", "pays"].map(
// //                             (field) => (
// //                                 <input
// //                                     key={field}
// //                                     type="text"
// //                                     placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
// //                                     value={(newEntreprise as any)[field] || ""}
// //                                     onChange={(e) => setNewEntreprise({ ...newEntreprise, [field]: e.target.value })}
// //                                     className="input-field"
// //                                 />
// //                             )
// //                         )}
// //                         <div>
// //                             <IconButton
// //                                 icon="Plus"
// //                                 color="blue"
// //                                 tooltip="Ajouter une entreprise"
// //                                 textButton="Ajouter une entreprise"
// //                                 type="submit"
// //                             />
// //                         </div>
// //                     </form>
// //                 )}
// //             </section>
// //
// //             {/* ======== SECTIONS ======== */}
// //             {entreprisePrincipale && (
// //                 <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
// //                     <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
// //                         <Building size={20} /> Sections / Annexes
// //                     </h3>
// //
// //                     {sections.map((s) => (
// //                         <EditableSection
// //                             key={s.id}
// //                             section={s}
// //                             vacances={vacances.filter((v) => v.sectionId === s.id)}
// //                             // sectionHoraires={sectionHoraires}
// //                             updateSection={updateSection}
// //                             updateHoraire={updateHoraire}
// //                             addVacances={addVacances}
// //                             updateVacances={updateVacances}
// //                             deleteVacances={deleteVacances}
// //                             deleteSection={deleteSection}
// //                         />
// //                     ))}
// //
// //                     {/* --- Ajouter section --- */}
// //                     <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-4">
// //                         {["nom", "ville", "email", "telephone", "adresse", "codePostal", "pays"].map(
// //                             (field) => (
// //                                 <input
// //                                     key={field}
// //                                     type="text"
// //                                     placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
// //                                     value={(newSection as any)[field] || ""}
// //                                     onChange={(e) => setNewSection({ ...newSection, [field]: e.target.value })}
// //                                     className="input-field"
// //                                 />
// //                             )
// //                         )}
// //                     </div>
// //
// //                     <IconButton
// //                         icon="Plus"
// //                         color="blue"
// //                         textButton="Ajouter une section"
// //                         tooltip="Ajouter une section"
// //                         onClick={async () => {
// //                             if (!newSection.nom || !entreprisePrincipale) return;
// //                             const added = await addSection({
// //                                 ...newSection,
// //                                 entrepriseId: entreprisePrincipale.id,
// //                             });
// //                             if (added) setNewSection({ nom: "", ville: "", email: "", telephone: "" });
// //                         }}
// //                     />
// //                 </section>
// //             )}
// //         </div>
// //     );
// // }
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
//
//
//
// "use client";
//
// import React, { useState, useEffect } from "react";
// import { Building, Calendar, Clock, Trash, Plus, Edit3, Save } from "lucide-react";
// import { useEntreprises } from "@/context/entrepriseContext";
// import {defaultFieldIcons, DynamicForm} from "@/components/ui/DynamicForm";
// import Collapsible from "@/components/ui/Collapsible";
// import {SectionCard} from "@/components/entreprise/SectionCard";
// import formatDateForInput from "@/utils/formatDateForInput";
//
//
//
// const EntrepriseDashboard: React.FC = () => {
//     const {
//         entreprises,
//         sections,
//         vacances,
//         loading,
//         addEntreprise,
//         updateEntreprise,
//         addSection,
//         updateSection,
//         deleteSection,
//         addHoraire,
//         updateHoraire,
//         addVacances,
//         updateVacances,
//         deleteVacances,
//     } = useEntreprises();
//
//     const entreprisePrincipale = entreprises[0] || null;
//
//     const [editingEntreprise, setEditingEntreprise] = useState(false);
//     const [dataEntreprise, setDataEntreprise] = useState<any>({});
//     const [dataHoraire, setDataHoraire] = useState<any>({});
//     const [vacancesData, setVacancesData] = useState<any[]>([]);
//     const [newVac, setNewVac] = useState<any>({ description: "", debut: "", fin: "" });
//     const [newSection, setNewSection] = useState<any>({ nom: "" });
//
//     useEffect(() => {
//         if (entreprisePrincipale) {
//             setDataEntreprise(entreprisePrincipale);
//             setDataHoraire(entreprisePrincipale.horaire || { ouverture: "", fermeture: "" });
//             setVacancesData(vacances.filter((v) => v.entrepriseId === entreprisePrincipale.id && !v.sectionId));
//         }
//     }, [entreprisePrincipale, vacances]);
//
//     if (loading) return <div className="text-center text-gray-500 mt-10 animate-pulse">Chargement...</div>;
//
//     const handleSaveEntreprise = async () => {
//         if (!entreprisePrincipale) {
//             const added = await addEntreprise(dataEntreprise);
//             setDataEntreprise(added);
//         } else {
//             await updateEntreprise(entreprisePrincipale.id, dataEntreprise);
//             if (dataHoraire.id) await updateHoraire(dataHoraire.id, dataHoraire);
//             else await addHoraire({ ...dataHoraire, entrepriseId: entreprisePrincipale.id });
//             for (const vac of vacancesData) {
//                 if (vac.id) await updateVacances(vac.id, vac);
//                 else await addVacances({ ...vac, entrepriseId: entreprisePrincipale.id });
//             }
//         }
//         setEditingEntreprise(false);
//     };
//
//     const handleAddVacEntreprise = async () => {
//         if (!newVac.debut || !newVac.fin) return;
//         const added = await addVacances({ ...newVac, entrepriseId: entreprisePrincipale?.id });
//         setVacancesData([...vacancesData, added]);
//         setNewVac({ description: "", debut: "", fin: "" });
//     };
//
//     const handleDeleteVacEntreprise = async (id?: number) => {
//         if (!id) return;
//         await deleteVacances(id);
//         setVacancesData(vacancesData.filter((v) => v.id !== id));
//     };
//
//     const handleAddSection = async () => {
//         if (!newSection.nom || !entreprisePrincipale) return;
//         const added = await addSection({ ...newSection, entrepriseId: entreprisePrincipale.id });
//         setNewSection({ nom: "" });
//     };
//     /** ✅ Annuler les modifications locales */
//     const handleCancel = () => {
//         if (entreprisePrincipale) {
//             setDataEntreprise(entreprisePrincipale);
//             setDataHoraire(entreprisePrincipale.horaire || { ouverture: "", fermeture: "" });
//             setVacancesData(
//                 vacances.filter((v) => v.entrepriseId === entreprisePrincipale.id && !v.sectionId)
//             );
//         }
//         setNewVac({ description: "", debut: "", fin: "" });
//         setEditingEntreprise(false);
//     };
//
//
//     return (
//         <div className="p-6 space-y-10 min-h-screen bg-gray-50">
//             {/* === Entreprise principale === */}
//             {!entreprisePrincipale ? (
//                 <div className="bg-white p-6 shadow-md rounded-2xl">
//                     <h2 className="text-2xl font-bold mb-4">Ajouter l&#39;entreprise principale</h2>
//                     <DynamicForm
//                         data={dataEntreprise}
//                         setData={setDataEntreprise}
//                         fields={["nom", "email", "telephone", "adresse", "ville", "codePostal", "pays"]}
//                         onSubmit={handleSaveEntreprise}
//                         submitLabel="Ajouter entreprise"
//                         columns={2}
//                     />
//                 </div>
//             ) : (
//                 <section className="bg-white p-6 shadow-md rounded-2xl border border-gray-100">
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-2xl font-bold flex items-center gap-2">
//                             <Building size={24} /> Entreprise principale
//                         </h2>
//                         {!editingEntreprise ? (
//                             <button className="text-blue-500 font-medium flex items-center gap-1" onClick={() => setEditingEntreprise(true)}>
//                                 <Edit3 size={16} /> Modifier
//                             </button>
//                         ) : (
//                             <div className="flex gap-2">
//                                 <button className="flex items-center gap-1 text-green-500 font-medium" onClick={handleSaveEntreprise}>
//                                     <Save size={16} /> Enregistrer
//                                 </button>
//                                 <button className="text-gray-500 font-medium" onClick={handleCancel}>Annuler</button>
//                             </div>
//                         )}
//                     </div>
//
//                     <DynamicForm
//                         data={dataEntreprise}
//                         setData={setDataEntreprise}
//                         fields={["nom", "email", "telephone", "adresse", "ville", "codePostal", "pays"]}
//                         fieldIcons={defaultFieldIcons}
//                         columns={2} // affichage en 2 colonnes
//                         readOnly={!editingEntreprise}
//                     />
//
//                     <h3 className="text-lg font-semibold flex items-center gap-2 mt-6 mb-2">
//                         <Clock size={18} /> Horaires
//                     </h3>
//                     <DynamicForm
//                         data={dataHoraire}
//                         setData={setDataHoraire}
//                         fields={["ouverture", "fermeture"]}
//                         fieldTypes={{ ouverture: "time", fermeture: "time" }}
//                         inline
//                         readOnly={!editingEntreprise}
//                     />
//
//                     <Collapsible title="Vacances" icon={<Calendar size={18} />}>
//                         {vacancesData.map((v) => (
//                             <div key={v.id} className="flex items-center gap-2 mb-2">
//                                 <DynamicForm
//                                     data={{ description: v.description, debut: formatDateForInput(v.debut), fin: formatDateForInput(v.fin) }}
//                                     setData={(d) =>
//                                         setVacancesData(vacancesData.map((x) => (x.id === v.id ? { ...x, ...d } : x)))
//                                     }
//                                     fields={["description", "debut", "fin"]}
//                                     fieldTypes={{ debut: "date", fin: "date" }}
//                                     inline
//                                     readOnly={!editingEntreprise}
//                                 />
//                                 {editingEntreprise && <button onClick={() => handleDeleteVacEntreprise(v.id)}><Trash size={18} className="text-red-500" /></button>}
//                             </div>
//                         ))}
//                         {editingEntreprise && (
//                             <div className="flex gap-2 mt-2">
//                                 <DynamicForm
//                                     data={newVac}
//                                     setData={setNewVac}
//                                     fields={["description", "debut", "fin"]}
//                                     fieldTypes={{ debut: "date", fin: "date" }}
//                                     inline
//                                 />
//                                 <button className="text-blue-500" onClick={handleAddVacEntreprise}>
//                                     <Plus size={18} />
//                                 </button>
//                             </div>
//                         )}
//                     </Collapsible>
//                 </section>
//             )}
//
//             {/* === Sections === */}
//             {sections.map((s) => (
//                 <SectionCard
//                     key={s.id}
//                     section={s}
//                     entrepriseId={entreprisePrincipale?.id || 0}
//                     updateSection={updateSection}
//                     deleteSection={deleteSection}
//                     addVacances={addVacances}
//                     updateVacances={updateVacances}
//                     deleteVacances={deleteVacances}
//                 />
//             ))}
//
//             {/* Ajouter nouvelle section */}
//             {entreprisePrincipale && (
//                 <div className="mt-6 flex flex-wrap gap-2 items-center">
//                     <DynamicForm data={newSection} setData={setNewSection} fields={["nom"]} inline submitLabel="Ajouter section" onSubmit={handleAddSection} />
//                     <button onClick={handleAddSection} className="text-green-500 flex items-center gap-1">
//                         <Plus size={20} /> Ajouter
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default EntrepriseDashboard;



"use client";

import React, { useState, useEffect } from "react";
import { Building, Calendar, Clock, Trash, Plus, Edit3, Save, X } from "lucide-react";
import { useEntreprises } from "@/context/entrepriseContext";
import { defaultFieldIcons, DynamicForm } from "@/components/ui/DynamicForm";
import Collapsible from "@/components/ui/Collapsible";
import { SectionCard } from "@/components/entreprise/SectionCard";
import formatDateForInput from "@/utils/formatDateForInput";

const EntrepriseDashboard: React.FC = () => {
    const {
        entreprises,
        sections,
        vacances,
        loading,
        addEntreprise,
        updateEntreprise,
        addSection,
        updateSection,
        deleteSection,
        addHoraire,
        updateHoraire,
        addVacances,
        updateVacances,
        deleteVacances,
    } = useEntreprises();

    const entreprisePrincipale = entreprises[0] || null;

    const [editingEntreprise, setEditingEntreprise] = useState(false);
    const [dataEntreprise, setDataEntreprise] = useState<any>({});
    const [dataHoraire, setDataHoraire] = useState<any>({});
    const [vacancesData, setVacancesData] = useState<any[]>([]);
    const [newVac, setNewVac] = useState<any>({ description: "", debut: "", fin: "" });
    const [newSection, setNewSection] = useState<any>({ nom: "" });

    const [vacancesOpen, setVacancesOpen] = useState(false);

    useEffect(() => {
        if (entreprisePrincipale) {
            setDataEntreprise(entreprisePrincipale);
            setDataHoraire(entreprisePrincipale.horaire || { ouverture: "", fermeture: "" });
            setVacancesData(
                vacances.filter((v) => v.entrepriseId === entreprisePrincipale.id && !v.sectionId)
            );
        }
    }, [entreprisePrincipale, vacances]);

    if (loading)
        return (
            <div className="text-center text-gray-500 mt-10 animate-pulse">
                Chargement...
            </div>
        );

    /** ✅ Annuler les modifications locales */
    const handleCancel = () => {
        if (entreprisePrincipale) {
            setDataEntreprise(entreprisePrincipale);
            setDataHoraire(entreprisePrincipale.horaire || { ouverture: "", fermeture: "" });
            setVacancesData(
                vacances.filter((v) => v.entrepriseId === entreprisePrincipale.id && !v.sectionId)
            );
        }
        setVacancesOpen(false);
        setNewVac({ description: "", debut: "", fin: "" });
        setEditingEntreprise(false);
    };

    /** ✅ Enregistrer les changements entreprise principale */
    const handleSaveEntreprise = async () => {
        if (!entreprisePrincipale) {
            const added = await addEntreprise(dataEntreprise);
            setDataEntreprise(added);
        } else {
            await updateEntreprise(entreprisePrincipale.id, dataEntreprise);

            if (dataHoraire.id)
                await updateHoraire(dataHoraire.id, dataHoraire);
            else
                await addHoraire({ ...dataHoraire, entrepriseId: entreprisePrincipale.id });

            for (const vac of vacancesData) {
                if (vac.id) await updateVacances(vac.id, vac);
                else await addVacances({ ...vac, entrepriseId: entreprisePrincipale.id });
            }
        }

        setEditingEntreprise(false);
    };

    /** ✅ Ajouter des vacances entreprise */
    const handleAddVacEntreprise = async () => {
        if (!newVac.debut || !newVac.fin) return;
        const added = await addVacances({
            ...newVac,
            entrepriseId: entreprisePrincipale?.id,
        });
        setVacancesData([...vacancesData, added]);
        setNewVac({ description: "", debut: "", fin: "" });
    };

    /** ✅ Supprimer des vacances entreprise */
    const handleDeleteVacEntreprise = async (id?: number) => {
        if (!id) return;
        await deleteVacances(id);
        setVacancesData(vacancesData.filter((v) => v.id !== id));
    };

    /** ✅ Ajouter section */
    const handleAddSection = async () => {
        if (!newSection.nom || !entreprisePrincipale) return;
         await addSection({
            ...newSection,
            entrepriseId: entreprisePrincipale.id,
        });
        setNewSection({ nom: "" });
    };

    return (
        <div className="p-6 space-y-10 min-h-screen bg-gray-50">
            {/* === Entreprise principale === */}
            {!entreprisePrincipale ? (
                <div className="bg-white p-6 shadow-md rounded-2xl">
                    <h2 className="text-2xl font-bold mb-4">
                        Ajouter l&#39;entreprise principale
                    </h2>
                    <DynamicForm
                        data={dataEntreprise}
                        setData={setDataEntreprise}
                        fields={["nom", "email", "telephone", "adresse", "ville", "codePostal", "pays"]}
                        onSubmit={handleSaveEntreprise}
                        submitLabel="Ajouter entreprise"
                        columns={2}
                    />
                </div>
            ) : (
                <section className="bg-white p-6 shadow-md rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Building size={24} /> Entreprise principale
                        </h2>
                        {!editingEntreprise ? (
                            <button
                                className="text-blue-500 font-medium flex items-center gap-1"
                                onClick={() => setEditingEntreprise(true)}
                            >
                                <Edit3 size={16} /> Modifier
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    className="flex items-center gap-1 text-green-500 font-medium"
                                    onClick={handleSaveEntreprise}
                                >
                                    <Save size={16} /> Enregistrer
                                </button>
                                <button
                                    className="flex items-center gap-1 text-gray-500 font-medium"
                                    onClick={handleCancel}
                                >
                                    <X size={16} /> Annuler
                                </button>
                            </div>
                        )}
                    </div>

                    {/* === Informations entreprise === */}
                    <DynamicForm
                        data={dataEntreprise}
                        setData={setDataEntreprise}
                        fields={["nom", "email", "telephone", "adresse", "ville", "codePostal", "pays"]}
                        fieldIcons={defaultFieldIcons}
                        columns={3}
                        readOnly={!editingEntreprise}
                    />

                    {/* === Horaires === */}
                    <h3 className="text-lg font-semibold flex items-center gap-2 mt-6 mb-2">
                        <Clock size={18} /> Horaires
                    </h3>
                    <DynamicForm
                        data={dataHoraire}
                        setData={setDataHoraire}
                        fields={["ouverture", "fermeture"]}
                        fieldTypes={{ ouverture: "time", fermeture: "time" }}
                        inline
                        readOnly={!editingEntreprise}
                    />

                    {/* === Vacances === */}

                    <Collapsible
                        title="Vacances"
                        icon={<Calendar size={16} />}
                        open={vacancesOpen}       // 👈 état contrôlé par le parent
                        onToggle={(isOpen) => setVacancesOpen(isOpen)} // 👈 sync avec parent
                    >
                        {vacancesData.map((v) => (
                            <div key={v.id} className="flex items-center gap-2 mb-2">
                                <DynamicForm
                                    data={{
                                        description: v.description,
                                        debut: formatDateForInput(v.debut),
                                        fin: formatDateForInput(v.fin),
                                    }}
                                    setData={(d) =>
                                        setVacancesData(
                                            vacancesData.map((x) => (x.id === v.id ? { ...x, ...d } : x))
                                        )
                                    }
                                    fields={["description", "debut", "fin"]}
                                    fieldTypes={{ debut: "date", fin: "date" }}
                                    inline
                                    className={"grid grid-cols-4 gap-2"}
                                    readOnly={!editingEntreprise}
                                />
                                {editingEntreprise && (
                                    <button className={"flex flex-end"} onClick={() => handleDeleteVacEntreprise(v.id)}>
                                        <Trash size={18} className="text-red-500" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {editingEntreprise && (
                            <div className="flex items-center  gap-2 mb-2">
                                <DynamicForm
                                    data={newVac}
                                    setData={setNewVac}
                                    fields={["description", "debut", "fin"]}
                                    fieldTypes={{ debut: "date", fin: "date" }}
                                    className={"grid grid-cols-4 gap-2"}

                                    inline
                                />
                                <button className="text-blue-500" onClick={handleAddVacEntreprise}>
                                    <Plus size={18} />
                                </button>
                            </div>
                        )}
                    </Collapsible>
                </section>
            )}

            {/* === Sections === */}
            {sections.map((s) => (
                <SectionCard
                    key={s.id}
                    section={s}
                    entrepriseId={entreprisePrincipale?.id || 0}
                    updateSection={updateSection}
                    deleteSection={deleteSection}
                    addVacances={addVacances}
                    updateVacances={updateVacances}
                    deleteVacances={deleteVacances}
                />
            ))}

            {/* === Ajouter section === */}
            {entreprisePrincipale && (
                <div className="mt-6 flex flex-wrap gap-2 items-center">
                    <DynamicForm
                        data={newSection}
                        setData={setNewSection}
                        fields={["nom"]}
                        inline
                        submitLabel="Ajouter section"
                        onSubmit={handleAddSection}
                    />
                </div>
            )}
        </div>
    );
};

export default EntrepriseDashboard;