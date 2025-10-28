// // "use client";
// //
// // import React, { useEffect, useState } from "react";
// // import { Clock, Calendar, Building, Plus } from "lucide-react";
// // import { Entreprise, Horaire, Section, Vacances } from "@/types/entreprise";
// // import { useEntreprises } from "@/context/entrepriseContext";
// //
// // // ================= Sous-composants =================
// //
// // function EditableVacances({
// //   vacances,
// //   onUpdate,
// //   onDelete,
// // }: {
// //   vacances: Vacances;
// //   onUpdate: (id: number, data: Partial<Vacances>) => Promise<void>;
// //   onDelete: (id: number) => void;
// // }) {
// //   const [editing, setEditing] = useState(false);
// //   const [desc, setDesc] = useState(vacances.description);
// //   const [debut, setDebut] = useState(vacances.debut);
// //   const [fin, setFin] = useState(vacances.fin);
// //   return (
// //     <li className="p-2 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center">
// //       {editing ? (
// //         <div className="flex gap-2 flex-wrap items-center">
// //           <input
// //             type="text"
// //             value={desc}
// //             onChange={(e) => setDesc(e.target.value)}
// //             className="input-field"
// //           />
// //           <input
// //             type="date"
// //             value={debut}
// //             onChange={(e) => setDebut(e.target.value)}
// //             className="input-field"
// //           />
// //           <input
// //             type="date"
// //             value={fin}
// //             onChange={(e) => setFin(e.target.value)}
// //             className="input-field"
// //           />
// //           <button
// //             className="btn btn-sm btn-primary"
// //             onClick={async () => {
// //               await onUpdate(vacances.id, { description: desc, debut, fin });
// //               setEditing(false);
// //             }}
// //           >
// //             💾
// //           </button>
// //           <button
// //             className="btn btn-sm btn-accent"
// //             onClick={() => {
// //               setDesc(vacances.description);
// //               setDebut(vacances.debut);
// //               setFin(vacances.fin);
// //               setEditing(false);
// //             }}
// //           >
// //             ❌
// //           </button>
// //         </div>
// //       ) : (
// //         <>
// //           <span>
// //             {vacances.description ? `${vacances.description} : ` : ""}
// //             {new Date(vacances.debut).toLocaleDateString()} –{" "}
// //             {new Date(vacances.fin).toLocaleDateString()}
// //           </span>
// //           <div className="flex gap-2">
// //             <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}>
// //               ✏️
// //             </button>
// //             <button className="btn btn-sm btn-accent" onClick={() => onDelete(vacances.id)}>
// //               🗑️
// //             </button>
// //           </div>
// //         </>
// //       )}
// //     </li>
// //   );
// // }
// //
// // // function EditableHoraire({
// // //                              value,
// // //                              onSave,
// // //                          }: {
// // //     value: { ouverture: string; fermeture: string };
// // //     onSave: (data: { ouverture: string; fermeture: string }) => Promise<void>;
// // // }) {
// // //     const [horaire, setHoraire] = useState(value);
// // //
// // //     useEffect(() => {
// // //         setHoraire(value); // sync si le parent change
// // //     }, [value]);
// // //
// // //     return (
// // //         <div className="flex flex-wrap gap-3 items-center">
// // //             <input
// // //                 type="time"
// // //                 value={horaire.ouverture}
// // //                 onChange={(e) => setHoraire({ ...horaire, ouverture: e.target.value })}
// // //                 className="input-field"
// // //             />
// // //             <span className="text-gray-500 font-medium">–</span>
// // //             <input
// // //                 type="time"
// // //                 value={horaire.fermeture}
// // //                 onChange={(e) => setHoraire({ ...horaire, fermeture: e.target.value })}
// // //                 className="input-field"
// // //             />
// // //             <button
// // //                 type="button"
// // //                 className="btn btn-primary"
// // //                 onClick={async () => {
// // //                     await onSave(horaire);
// // //                 }}
// // //             >
// // //                 💾 Enregistrer
// // //             </button>
// // //         </div>
// // //     );
// // // }
// //
// // interface EditableHoraireProps {
// //   value: Horaire;
// // }
// //
// // export function EditableHoraire({ value }: EditableHoraireProps) {
// //   const [horaire, setHoraire] = useState<Horaire>({
// //     id: value.id,
// //     ouverture: value.ouverture || "",
// //     fermeture: value.fermeture || "",
// //     entrepriseId: value.entrepriseId ?? null,
// //     sectionId: value.sectionId ?? null,
// //   });
// //
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState<string | null>(null);
// //
// //   const { addHoraire, updateHoraire } = useEntreprises();
// //
// //
// //   const handleSave = async () => {
// //     if (!horaire.ouverture || !horaire.fermeture) {
// //       setMessage("⛔ Les deux horaires sont obligatoires.");
// //       return;
// //     }
// //
// //     setLoading(true);
// //     setMessage(null);
// //
// //     try {
// //       if (horaire.id) {
// //         // 🟡 UPDATE (PUT)
// //         const result = await updateHoraire(horaire.id, {
// //           ouverture: horaire.ouverture,
// //           fermeture: horaire.fermeture,
// //           entrepriseId: horaire.entrepriseId,
// //           sectionId: horaire.sectionId,
// //         });
// //         if (result?.id) setHoraire((prev) => ({ ...prev, id: result.id }));
// //         setMessage("✅ Horaire mis à jour !");
// //       } else {
// //         // 🟢 CREATE (POST)
// //         const result = await addHoraire({
// //           ouverture: horaire.ouverture,
// //           fermeture: horaire.fermeture,
// //           entrepriseId: horaire.entrepriseId,
// //           sectionId: horaire.sectionId,
// //         });
// //         if (result?.id) setHoraire((prev) => ({ ...prev, id: result.id }));
// //         setMessage("✅ Horaire créé !");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setMessage("❌ Erreur lors de l'enregistrement.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //
// //   return (
// //     <div className="flex flex-wrap items-center gap-3">
// //       <input
// //         type="time"
// //         value={horaire.ouverture}
// //         onChange={(e) => setHoraire((prev) => ({ ...prev, ouverture: e.target.value }))}
// //         className="input-field"
// //       />
// //       <span className="text-gray-500 font-medium">–</span>
// //       <input
// //         type="time"
// //         value={horaire.fermeture}
// //         onChange={(e) => setHoraire((prev) => ({ ...prev, fermeture: e.target.value }))}
// //         className="input-field"
// //       />
// //       <button
// //         className={`btn ${horaire.id ? "btn-primary" : "btn-success"}`}
// //         disabled={loading}
// //         onClick={handleSave}
// //       >
// //         {loading ? "💾 Enregistrement..." : horaire.id ? "✏️ Mettre à jour" : "🆕 Créer"}
// //       </button>
// //       {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
// //     </div>
// //   );
// // }
// //
// // function EntrepriseInfo({
// //   entreprise,
// //   updateEntreprise,
// // }: {
// //   entreprise: Entreprise;
// //   updateEntreprise: (id: number, data: Partial<Entreprise>) => Promise<void>;
// // }) {
// //   const [editingAll, setEditingAll] = useState(false);
// //   const [formValues, setFormValues] = useState({
// //     nom: entreprise.nom,
// //     siret: entreprise.siret,
// //     ville: entreprise.ville,
// //     pays: entreprise.pays,
// //     adresse: entreprise.adresse,
// //     codePostal: entreprise.codePostal,
// //     email: entreprise.email,
// //     telephone: entreprise.telephone,
// //   });
// //
// //   const handleChange = (field: string, value: string) => {
// //     setFormValues({ ...formValues, [field]: value });
// //   };
// //
// //   const handleSaveAll = async () => {
// //     await updateEntreprise(entreprise.id, formValues);
// //     setEditingAll(false);
// //   };
// //
// //   return (
// //     <div className="mb-8">
// //       <div className="flex justify-between items-center mb-4">
// //         <h3 className="text-lg font-semibold">Informations de l’entreprise</h3>
// //         {!editingAll ? (
// //           <button className="btn btn-primary" onClick={() => setEditingAll(true)}>
// //             Modifier
// //           </button>
// //         ) : (
// //           <div className="flex gap-2">
// //             <button className="btn btn-primary" onClick={handleSaveAll}>
// //               💾 Enregistrer
// //             </button>
// //             <button
// //               className="btn btn-accent"
// //               onClick={() => {
// //                 setFormValues({
// //                   nom: entreprise.nom,
// //                   siret: entreprise.siret,
// //                   ville: entreprise.ville,
// //                   pays: entreprise.pays,
// //                   adresse: entreprise.adresse,
// //                   codePostal: entreprise.codePostal,
// //                   email: entreprise.email,
// //                   telephone: entreprise.telephone,
// //                 });
// //                 setEditingAll(false);
// //               }}
// //             >
// //               ❌ Annuler
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
// //         {Object.entries(formValues).map(([field, value]) => (
// //           <div key={field} className="flex items-center gap-2 text-sm md:text-base">
// //             <span className="font-semibold text-gray-800">
// //               {field.charAt(0).toUpperCase() + field.slice(1)} :
// //             </span>
// //             {editingAll ? (
// //               <input
// //                 type="text"
// //                 value={value}
// //                 onChange={(e) => handleChange(field, e.target.value)}
// //                 className="input-field"
// //               />
// //             ) : (
// //               <span>{value}</span>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
// //
// // function EditableSection({
// //   section,
// //   vacances,
// //   sectionHoraires,
// //   updateSection,
// //   updateHoraire,
// //   addVacances,
// //   updateVacances,
// //   deleteVacances,
// //   deleteSection,
// // }: {
// //   section: Section;
// //   vacances: Vacances[];
// //   sectionHoraires: { [key: number]: { ouverture: string; fermeture: string } };
// //   updateSection: (id: number, data: Partial<Section>) => Promise<void>;
// //   updateHoraire: (
// //     id: string,
// //     data: number,
// //     type: { ouverture: string; fermeture: string },
// //   ) => Promise<void>;
// //   addVacances: (data: Partial<Vacances>) => Promise<void>;
// //   updateVacances: (id: number, data: Partial<Vacances>) => Promise<void>;
// //   deleteVacances: (id: number) => void;
// //   deleteSection: (id: number) => void;
// // }) {
// //   const [editing, setEditing] = useState(false);
// //   const [nom, setNom] = useState(section.nom);
// //   const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });
// //
// //   return (
// //     <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-4 hover:shadow-sm transition">
// //       {/* Nom */}
// //       <div className="flex justify-between items-center mb-3">
// //         {editing ? (
// //           <div className="flex gap-2 flex-wrap items-center">
// //             <input value={nom} onChange={(e) => setNom(e.target.value)} className="input-field" />
// //             <button
// //               className="btn btn-sm btn-primary"
// //               onClick={async () => {
// //                 await updateSection(section.id, { nom });
// //                 setEditing(false);
// //               }}
// //             >
// //               💾
// //             </button>
// //             <button
// //               className="btn btn-sm btn-accent"
// //               onClick={() => {
// //                 setNom(section.nom);
// //                 setEditing(false);
// //               }}
// //             >
// //               ❌
// //             </button>
// //           </div>
// //         ) : (
// //           <>
// //             <span className="font-semibold text-gray-800 text-lg">{section.nom}</span>
// //             <div className="flex gap-2">
// //               <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}>
// //                 ✏️
// //               </button>
// //               <button className="btn btn-sm btn-accent" onClick={() => deleteSection(section.id)}>
// //                 🗑️
// //               </button>
// //             </div>
// //           </>
// //         )}
// //       </div>
// //
// //       {/* Horaires */}
// //       <EditableHoraire
// //         value={{
// //           id: section.horaire?.id ?? null, // 🔹 important
// //           ouverture: section.horaire?.ouverture ?? "",
// //           fermeture: section.horaire?.fermeture ?? "",
// //           sectionId: section.id ?? null,
// //         }}
// //       />
// //
// //       {/* Vacances */}
// //       <h5 className="font-medium text-gray-700 mt-3 mb-2 flex items-center gap-2">
// //         <Calendar size={16} /> Vacances
// //       </h5>
// //       <ul className="space-y-2 mb-3">
// //         {vacances.map((v) => (
// //           <EditableVacances
// //             key={v.id}
// //             vacances={v}
// //             onUpdate={updateVacances}
// //             onDelete={deleteVacances}
// //           />
// //         ))}
// //       </ul>
// //
// //       {/* Ajouter vacances */}
// //       <div className="flex flex-wrap gap-3">
// //         <input
// //           type="text"
// //           placeholder="Description"
// //           value={newVac.description}
// //           onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}
// //           className="input-field flex-1"
// //         />
// //         <input
// //           type="date"
// //           value={newVac.debut}
// //           onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })}
// //           className="input-field"
// //         />
// //         <input
// //           type="date"
// //           value={newVac.fin}
// //           onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })}
// //           className="input-field"
// //         />
// //         <button
// //           className="btn btn-accent flex items-center gap-2"
// //           onClick={async () => {
// //             if (!newVac.debut || !newVac.fin) return;
// //             await addVacances({ ...newVac, sectionId: section.id });
// //             setNewVac({ description: "", debut: "", fin: "" });
// //           }}
// //         >
// //           <Plus size={16} /> Ajouter
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
// //
// //
// // export default function EntrepriseDashboard() {
// //   const {
// //     entreprises,
// //     sections,
// //     vacances,
// //     loading,
// //     addEntreprise,
// //     addSection,
// //     updateSection,
// //     addVacances,
// //     updateHoraire,
// //     updateEntreprise,
// //     updateVacances,
// //     deleteVacances,
// //     deleteSection,
// //   } = useEntreprises();
// //
// //   const [sectionHoraires, setSectionHoraires] = useState<{
// //     [key: number | "entreprise"]: { ouverture: string; fermeture: string };
// //   }>({});
// //   const [newSection, setNewSection] = useState<Partial<Section>>({ nom: "" });
// //   const [newEntreprise, setNewEntreprise] = useState<Partial<Entreprise>>({});
// //   const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });
// //
// //   if (loading)
// //     return <div className="text-center text-gray-500 mt-10 animate-pulse">Chargement...</div>;
// //
// //   const entreprisePrincipale = entreprises[0] || null;
// //
// //   return (
// //     <div className="p-6 space-y-10 min-h-screen">
// //       {/* Entreprise Principale ou Formulaire */}
// //       <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
// //         <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
// //           <Building size={24} /> Entreprise principale
// //         </h2>
// //
// //         {entreprisePrincipale ? (
// //           <>
// //             <EntrepriseInfo entreprise={entreprisePrincipale} updateEntreprise={updateEntreprise} />
// //
// //             <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
// //               <Clock size={18} /> Horaires
// //             </h4>
// //
// //             <EditableHoraire
// //               value={{
// //                 id: entreprisePrincipale.horaire?.id ?? null, // 🔹 important
// //                 ouverture: entreprisePrincipale.horaire?.ouverture ?? "",
// //                 fermeture: entreprisePrincipale.horaire?.fermeture ?? "",
// //                 entrepriseId: entreprisePrincipale.id ?? null,
// //               }}
// //             />
// //
// //             <h4 className="font-semibold text-gray-700 flex items-center gap-2 mt-8">
// //               <Calendar size={18} /> Vacances
// //             </h4>
// //             <ul className="space-y-2 mt-3">
// //               {vacances
// //                 .filter((v) => v.entrepriseId === entreprisePrincipale.id)
// //                 .map((v) => (
// //                   <EditableVacances
// //                     key={v.id}
// //                     vacances={v}
// //                     onUpdate={updateVacances}
// //                     onDelete={deleteVacances}
// //                   />
// //                 ))}
// //             </ul>
// //
// //             {/* Ajouter vacances entreprise */}
// //             <div className="flex flex-wrap gap-3">
// //               <input
// //                 type="text"
// //                 placeholder="Description"
// //                 value={newVac.description}
// //                 onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}
// //                 className="input-field flex-1"
// //               />
// //               <input
// //                 type="date"
// //                 value={newVac.debut}
// //                 onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })}
// //                 className="input-field"
// //               />
// //               <input
// //                 type="date"
// //                 value={newVac.fin}
// //                 onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })}
// //                 className="input-field"
// //               />
// //               <button
// //                 className="btn btn-accent flex items-center gap-2"
// //                 onClick={async () => {
// //                   if (!newVac.debut || !newVac.fin) return;
// //                   await addVacances({ ...newVac, entrepriseId: entreprisePrincipale.id });
// //                   setNewVac({ description: "", debut: "", fin: "" });
// //                 }}
// //               >
// //                 <Plus size={16} /> Ajouter
// //               </button>
// //             </div>
// //           </>
// //         ) : (
// //           // Formulaire création entreprise
// //           <form
// //             className="grid grid-cols-1 md:grid-cols-2 gap-4"
// //             onSubmit={async (e) => {
// //               e.preventDefault();
// //               if (!newEntreprise.nom) return;
// //               await addEntreprise(newEntreprise);
// //               setNewEntreprise({});
// //             }}
// //           >
// //             <input
// //               type="text"
// //               placeholder="Nom de l'entreprise"
// //               value={newEntreprise.nom || ""}
// //               onChange={(e) => setNewEntreprise({ ...newEntreprise, nom: e.target.value })}
// //               className="input-field"
// //             />
// //             <input
// //               type="text"
// //               placeholder="Ville"
// //               value={newEntreprise.ville || ""}
// //               onChange={(e) => setNewEntreprise({ ...newEntreprise, ville: e.target.value })}
// //               className="input-field"
// //             />
// //             <input
// //               type="text"
// //               placeholder="Email"
// //               value={newEntreprise.email || ""}
// //               onChange={(e) => setNewEntreprise({ ...newEntreprise, email: e.target.value })}
// //               className="input-field"
// //             />
// //             <input
// //               type="text"
// //               placeholder="Téléphone"
// //               value={newEntreprise.telephone || ""}
// //               onChange={(e) => setNewEntreprise({ ...newEntreprise, telephone: e.target.value })}
// //               className="input-field"
// //             />
// //             <button type="submit" className="btn btn-accent mt-2 flex items-center gap-2">
// //               <Plus size={16} /> Ajouter l'entreprise
// //             </button>
// //           </form>
// //         )}
// //       </section>
// //
// //       {/* Sections */}
// //       {entreprisePrincipale && (
// //         <section className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
// //           <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
// //             <Building size={20} /> Sections / Annexes
// //           </h3>
// //
// //           {sections.map((s) => (
// //             <EditableSection
// //               key={s.id}
// //               section={s}
// //               vacances={vacances.filter((v) => v.sectionId === s.id)}
// //               sectionHoraires={sectionHoraires}
// //               updateSection={updateSection}
// //               updateHoraire={updateHoraire}
// //               addVacances={addVacances}
// //               updateVacances={updateVacances}
// //               deleteVacances={deleteVacances}
// //               deleteSection={deleteSection}
// //             />
// //           ))}
// //
// //           {/* Ajouter nouvelle section */}
// //           <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
// //             <input
// //               type="text"
// //               placeholder="Nom"
// //               value={newSection.nom || ""}
// //               onChange={(e) => setNewSection({ ...newSection, nom: e.target.value })}
// //               className="input-field"
// //             />
// //             <input
// //               type="text"
// //               placeholder="Ville"
// //               value={newSection.ville || ""}
// //               onChange={(e) => setNewSection({ ...newSection, ville: e.target.value })}
// //               className="input-field"
// //             />
// //             <input
// //               type="text"
// //               placeholder="Email"
// //               value={newSection.email || ""}
// //               onChange={(e) => setNewSection({ ...newSection, email: e.target.value })}
// //               className="input-field"
// //             />
// //             <input
// //               type="text"
// //               placeholder="Téléphone"
// //               value={newSection.telephone || ""}
// //               onChange={(e) => setNewSection({ ...newSection, telephone: e.target.value })}
// //               className="input-field"
// //             />
// //           </div>
// //           <button
// //             className="btn btn-accent mt-3 flex items-center gap-2"
// //             onClick={async () => {
// //               if (!newSection.nom || !entreprisePrincipale) return;
// //               const added = await addSection({
// //                 ...newSection,
// //                 entrepriseId: entreprisePrincipale.id,
// //               });
// //               if (added) setNewSection({ nom: "", ville: "", email: "", telephone: "" });
// //             }}
// //           >
// //             <Plus size={16} /> Ajouter une section
// //           </button>
// //         </section>
// //       )}
// //     </div>
// //   );
// // }
//
//
//
// "use client";
//
// import React, { useEffect, useState } from "react";
// import { Clock, Calendar, Building, Plus } from "lucide-react";
// import { Entreprise, Horaire, Section, Vacances } from "@/types/entreprise";
// import { useEntreprises } from "@/context/entrepriseContext";
//
// // ================= Sous-composants =================
//
// function EditableVacances({
//                               vacances,
//                               onUpdate,
//                               onDelete,
//                           }: {
//     vacances: Vacances;
//     onUpdate: (id: number, data: Partial<Vacances>) => Promise<void>;
//     onDelete: (id: number) => void;
// }) {
//     const [editing, setEditing] = useState(false);
//     const [desc, setDesc] = useState(vacances.description);
//     const [debut, setDebut] = useState(vacances.debut);
//     const [fin, setFin] = useState(vacances.fin);
//
//     const handleCancel = () => {
//         setDesc(vacances.description);
//         setDebut(vacances.debut);
//         setFin(vacances.fin);
//         setEditing(false);
//     };
//
//     const handleSave = async () => {
//         await onUpdate(vacances.id, { description: desc, debut, fin });
//         setEditing(false);
//     };
//
//     return (
//         <li className="p-2 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center">
//             {editing ? (
//                 <div className="flex gap-2 flex-wrap items-center">
//                     <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="input-field" />
//                     <input type="date" value={debut} onChange={(e) => setDebut(e.target.value)} className="input-field" />
//                     <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="input-field" />
//                     <button className="btn btn-sm btn-primary" onClick={handleSave}>💾</button>
//                     <button className="btn btn-sm btn-accent" onClick={handleCancel}>❌</button>
//                 </div>
//             ) : (
//                 <>
//           <span>
//             {vacances.description ? `${vacances.description} : ` : ""}
//               {new Date(vacances.debut).toLocaleDateString()} – {new Date(vacances.fin).toLocaleDateString()}
//           </span>
//                     <div className="flex gap-2">
//                         <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}>✏️</button>
//                         <button className="btn btn-sm btn-accent" onClick={() => onDelete(vacances.id)}>🗑️</button>
//                     </div>
//                 </>
//             )}
//         </li>
//     );
// }
//
// interface EditableHoraireProps { value: Horaire; }
//
// export function EditableHoraire({ value }: EditableHoraireProps) {
//     const [horaire, setHoraire] = useState<Horaire>({
//         id: value.id,
//         ouverture: value.ouverture || "",
//         fermeture: value.fermeture || "",
//         entrepriseId: value.entrepriseId ?? null,
//         sectionId: value.sectionId ?? null,
//     });
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState<string | null>(null);
//
//     const { addHoraire, updateHoraire } = useEntreprises();
//
//     const handleSave = async () => {
//         if (!horaire.ouverture || !horaire.fermeture) {
//             setMessage("⛔ Les deux horaires sont obligatoires.");
//             return;
//         }
//         setLoading(true);
//         setMessage(null);
//         try {
//             const result = horaire.id
//                 ? await updateHoraire(horaire.id, { ...horaire })
//                 : await addHoraire({ ...horaire });
//             if (result?.id) setHoraire((prev) => ({ ...prev, id: result.id }));
//             setMessage(horaire.id ? "✅ Horaire mis à jour !" : "✅ Horaire créé !");
//         } catch (err) {
//             console.error(err);
//             setMessage("❌ Erreur lors de l'enregistrement.");
//         } finally { setLoading(false); }
//     };
//
//
//     return (
//         <div className="flex flex-wrap items-center gap-3">
//             <input type="time" value={horaire.ouverture} onChange={(e) => setHoraire({ ...horaire, ouverture: e.target.value })} className="input-field" />
//             <span className="text-gray-500 font-medium">–</span>
//             <input type="time" value={horaire.fermeture} onChange={(e) => setHoraire({ ...horaire, fermeture: e.target.value })} className="input-field" />
//             <button className={`btn ${horaire.id ? "btn-primary" : "btn-success"}`} disabled={loading} onClick={handleSave}>
//                 {loading ? "💾 Enregistrement..." : horaire.id ? "✏️ Mettre à jour" : "🆕 Créer"}
//             </button>
//             {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
//         </div>
//     );
// }
//
// function EntrepriseInfo({ entreprise, updateEntreprise }: { entreprise: Entreprise; updateEntreprise: (id: number, data: Partial<Entreprise>) => Promise<void>; }) {
//     const [editingAll, setEditingAll] = useState(false);
//     const [formValues, setFormValues] = useState({
//         nom: entreprise.nom,
//         siret: entreprise.siret,
//         ville: entreprise.ville,
//         pays: entreprise.pays,
//         adresse: entreprise.adresse,
//         codePostal: entreprise.codePostal,
//         email: entreprise.email,
//         telephone: entreprise.telephone,
//     });
//
//     const handleChange = (field: string, value: string) => setFormValues({ ...formValues, [field]: value });
//     const handleSaveAll = async () => { await updateEntreprise(entreprise.id, formValues); setEditingAll(false); };
//
//     return (
//         <div className="mb-8">
//             <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Informations de l’entreprise</h3>
//                 {!editingAll ? <button className="btn btn-primary" onClick={() => setEditingAll(true)}>Modifier</button> : (
//                     <div className="flex gap-2">
//                         <button className="btn btn-primary" onClick={handleSaveAll}>💾 Enregistrer</button>
//                         <button className="btn btn-accent" onClick={() => { setFormValues({ ...entreprise }); setEditingAll(false); }}>❌ Annuler</button>
//                     </div>
//                 )}
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
//                 {Object.entries(formValues).map(([field, value]) => (
//                     typeof value === "object" ? null : (
//                         <div key={field} className="flex items-center gap-2 text-sm md:text-base">
//                             <span className="font-semibold text-gray-800">{field.charAt(0).toUpperCase() + field.slice(1)} :</span>
//                             {editingAll ? <input type="text" value={value} onChange={(e) => handleChange(field, e.target.value)} className="input-field" /> : <span>{value}</span>}
//                         </div>
//                     )
//                 ))}
//             </div>
//         </div>
//     );
// }
//
// function EditableSection({ section, vacances, sectionHoraires, updateSection, updateHoraire, addVacances, updateVacances, deleteVacances, deleteSection }: {
//     section: Section; vacances: Vacances[];
//     sectionHoraires: { [key: number]: { ouverture: string; fermeture: string } };
//     updateSection: (id: number, data: Partial<Section>) => Promise<void>;
//     updateHoraire: (id: string, data: number, type: { ouverture: string; fermeture: string }) => Promise<void>;
//     addVacances: (data: Partial<Vacances>) => Promise<void>;
//     updateVacances: (id: number, data: Partial<Vacances>) => Promise<void>;
//     deleteVacances: (id: number) => void;
//     deleteSection: (id: number) => void;
// }) {
//     const [editing, setEditing] = useState(false);
//     const [nom, setNom] = useState(section.nom);
//     const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });
//
//     const handleCancel = () => { setNom(section.nom); setEditing(false); };
//     const handleSave = async () => { await updateSection(section.id, { nom }); setEditing(false); };
//     const handleAddVac = async () => { if (!newVac.debut || !newVac.fin) return; await addVacances({ ...newVac, sectionId: section.id }); setNewVac({ description: "", debut: "", fin: "" }); };
//
//     return (
//         <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-4 hover:shadow-sm transition">
//             <div className="flex justify-between items-center mb-3">
//                 {editing ? (
//                     <div className="flex gap-2 flex-wrap items-center">
//                         <input value={nom} onChange={(e) => setNom(e.target.value)} className="input-field" />
//                         <button className="btn btn-sm btn-primary" onClick={handleSave}>💾</button>
//                         <button className="btn btn-sm btn-accent" onClick={handleCancel}>❌</button>
//                     </div>
//                 ) : (
//                     <>
//                         <span className="font-semibold text-gray-800 text-lg">{section.nom}</span>
//                         <div className="flex gap-2">
//                             <button className="btn btn-sm btn-primary" onClick={() => setEditing(true)}>✏️</button>
//                             <button className="btn btn-sm btn-accent" onClick={() => deleteSection(section.id)}>🗑️</button>
//                         </div>
//                     </>
//                 )}
//             </div>
//
//             <EditableHoraire value={{ id: section.horaire?.id ?? null, ouverture: section.horaire?.ouverture ?? "", fermeture: section.horaire?.fermeture ?? "", sectionId: section.id ?? null }} />
//
//             <h5 className="font-medium text-gray-700 mt-3 mb-2 flex items-center gap-2">
//                 <Calendar size={16} /> Vacances
//             </h5>
//             <ul className="space-y-2 mb-3">{vacances.map((v) => <EditableVacances key={v.id} vacances={v} onUpdate={updateVacances} onDelete={deleteVacances} />)}</ul>
//
//             <div className="flex flex-wrap gap-3">
//                 <input type="text" placeholder="Description" value={newVac.description} onChange={(e) => setNewVac({ ...newVac, description: e.target.value })} className="input-field flex-1" />
//                 <input type="date" value={newVac.debut} onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })} className="input-field" />
//                 <input type="date" value={newVac.fin} onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })} className="input-field" />
//                 <button className="btn btn-accent flex items-center gap-2" onClick={handleAddVac}><Plus size={16} /> Ajouter</button>
//             </div>
//         </div>
//     );
// }

// ================= Dashboard principal =================

import React, { useState } from "react";
import { useEntreprises } from "@/context/entrepriseContext";
import { Entreprise, Section } from "@/types/entreprise";
import { Building, Calendar, Clock, Plus } from "lucide-react";
import EntrepriseInfo from "@/components/entreprise/EntrepriseInfo";
import { EditableHoraire } from "@/components/entreprise/EditableHoraire";
import EditableVacances from "@/components/entreprise/EditableVacances";
import EditableSection from "@/components/entreprise/EditableSection";

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
  const [sectionHoraires] = useState<{
    [key: number]: { ouverture: string; fermeture: string };
  }>({});
  const [newSection, setNewSection] = useState<Partial<Section>>({ nom: "" });
  const [newEntreprise, setNewEntreprise] = useState<Partial<Entreprise>>({});
  const [newVac, setNewVac] = useState({ description: "", debut: "", fin: "" });

  if (loading)
    return <div className="text-center text-gray-500 mt-10 animate-pulse">Chargement...</div>;

  const entreprisePrincipale = entreprises[0] || null;

  return (
    <div className="p-6 space-y-10 min-h-screen">
      {/* Entreprise Principale */}
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
              value={{
                id: entreprisePrincipale.horaire?.id ?? null,
                ouverture: entreprisePrincipale.horaire?.ouverture ?? "",
                fermeture: entreprisePrincipale.horaire?.fermeture ?? "",
                entrepriseId: entreprisePrincipale.id ?? null,
              }}
            />

            <h4 className="font-semibold text-gray-700 flex items-center gap-2 mt-8">
              <Calendar size={18} /> Vacances
            </h4>
            <ul className="space-y-2 mt-3">
              {vacances
                .filter((v) => v.entrepriseId === entreprisePrincipale.id)
                .map((v) => (
                  <EditableVacances
                    key={v.id}
                    vacances={v}
                    onUpdate={updateVacances}
                    onDelete={deleteVacances}
                  />
                ))}
            </ul>

            {/*<div className="flex flex-wrap gap-3">*/}
            {/*  <input*/}
            {/*    type="text"*/}
            {/*    placeholder="Description"*/}
            {/*    value={newVac.description}*/}
            {/*    onChange={(e) => setNewVac({ ...newVac, description: e.target.value })}*/}
            {/*    className="input-field flex-1"*/}
            {/*  />*/}
            {/*  <input*/}
            {/*    type="date"*/}
            {/*    value={newVac.debut}*/}
            {/*    onChange={(e) => setNewVac({ ...newVac, debut: e.target.value })}*/}
            {/*    className="input-field"*/}
            {/*  />*/}
            {/*  <input*/}
            {/*    type="date"*/}
            {/*    value={newVac.fin}*/}
            {/*    onChange={(e) => setNewVac({ ...newVac, fin: e.target.value })}*/}
            {/*    className="input-field"*/}
            {/*  />*/}
            {/*  <button*/}
            {/*    className="btn btn-accent flex items-center gap-2"*/}
            {/*    onClick={async () => {*/}
            {/*      if (!newVac.debut || !newVac.fin) return;*/}
            {/*      await addVacances({ ...newVac, entrepriseId: entreprisePrincipale.id });*/}
            {/*      setNewVac({ description: "", debut: "", fin: "" });*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <Plus size={16} /> Ajouter*/}
            {/*  </button>*/}
            {/*</div>*/}
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
                      onClick={async () => {
                          if (!newVac.debut || !newVac.fin) return;
                          await addVacances({ ...newVac, entrepriseId: entreprisePrincipale.id });
                          setNewVac({ description: "", debut: "", fin: "" });
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                      <Plus size={16} />
                  </button>

              </div>
          </>
        ) : (
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
              <input
                  type="text"
                  placeholder="Siret"
                  value={newEntreprise.siret || ""}
                  onChange={(e) => setNewEntreprise({ ...newEntreprise, siret: e.target.value })}
                  className="input-field"
              />
              <input
                  type="text"
                  placeholder="Adresse"
                  value={newEntreprise.adresse || ""}
                  onChange={(e) => setNewEntreprise({ ...newEntreprise, adresse: e.target.value })}
                  className="input-field"
              />
              <input
                  type="text"
                  placeholder="Code postal"
                  value={newEntreprise.codePostal || ""}
                  onChange={(e) => setNewEntreprise({ ...newEntreprise, codePostal: e.target.value })}
                  className="input-field"
              />
              <input
                  type="text"
                  placeholder="Pays"
                  value={newEntreprise.pays || ""}
                  onChange={(e) => setNewEntreprise({ ...newEntreprise, pays: e.target.value })}
                  className="input-field"
              />
            <button type="submit" className="btn btn-accent mt-2 flex items-center gap-2">
              <Plus size={16} /> Ajouter l&#39;entreprise
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
              <input
              type="text"
              placeholder="Adresse "
              value={newSection.adresse || ""}
              onChange={(e) => setNewSection({ ...newSection, adresse: e.target.value })}
              className="input-field"
            />
              <input
              type="text"
              placeholder="Code postal "
              value={newSection.codePostal || ""}
              onChange={(e) => setNewSection({ ...newSection, codePostal: e.target.value })}
              className="input-field"
            />
              <input
                  type="text"
                  placeholder="Pays "
                  value={newSection.pays || ""}
                  onChange={(e) => setNewSection({ ...newSection, pays: e.target.value })}
                  className="input-field"
              />
          </div>
          <button
            className="btn btn-accent mt-3 flex items-center gap-2"
            onClick={async () => {
              if (!newSection.nom || !entreprisePrincipale) return;
              const added = await addSection({
                ...newSection,
                entrepriseId: entreprisePrincipale.id,
              });
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
