// import React, { useEffect, useState } from "react";
// import {defaultFieldIcons, DynamicForm} from "@/components/ui/DynamicForm";
// import { Building, Calendar, Clock, Edit3, Plus, Save, Trash, X } from "lucide-react";
// import Collapsible from "@/components/ui/Collapsible";
// import formatDateForInput from "@/utils/formatDateForInput";
// import {useEntreprises} from "@/context/entrepriseContext";
// import {Section, Vacances} from "@/types/entreprise";
//
// interface SectionCardProps {
//     section: Section;
//     entrepriseId: number;
//     updateSection: (id: number, data: Section) => Promise<void>;
//     deleteSection: (id: number) => Promise<void>;
//     addVacances: (data: Omit<Vacances, "id">) => Promise<Vacances>; // ✅ pas d'id attendu
//     updateVacances: (id: number, data: Vacances) => Promise<void>;
//     deleteVacances: (id: number) => Promise<void>;
// }
//
// export const SectionCard: React.FC<SectionCardProps> = ({
//                                                             section,
//                                                             entrepriseId,
//                                                             updateSection,
//                                                             deleteSection,
//                                                             addVacances,
//                                                             updateVacances,
//                                                             deleteVacances,
//                                                         }) => {
//     const [editing, setEditing] = useState(false);
//     const [VacancesData, setVacancesData] = useState({
//         ...section,
//         newVac: { description: "", debut: "", fin: "" },
//     });
//     const [dataHoraire, setDataHoraire] = useState<any>({});
//
//     const{addHoraire, updateHoraire} = useEntreprises();
//
//     const [vacancesOpen, setVacancesOpen] = useState(false);
//
//
//     /** 🔁 Synchronise les données si la section change */
//     useEffect(() => {
//         setVacancesData({
//             ...section,
//             newVac: { description: "", debut: "", fin: "" },
//         });
//
//         setDataHoraire(section.horaire || { ouverture: "", fermeture: "" });
//     }, [section]);
//
//     /** ✅ Sauvegarde section + horaires + vacances */
//     const handleSaveSection = async () => {
//
//         // 1️⃣ Sauvegarde de la section
//
//         if (section) {
//             await updateSection(section.id, VacancesData);
//
//         }
//
//         // 2️⃣ Sauvegarde des horaires (création ou update)
//             if (dataHoraire.id) {
//                 // Si l'horaire existe → update
//                 await updateHoraire(dataHoraire.id, dataHoraire);
//             } else {
//                 // Sinon → création
//                 await addHoraire({
//                     ...dataHoraire,
//                     sectionId: section.id,
//                 });
//             }
//
//
//         // 3️⃣ Sauvegarde des vacances
//         for (const vac of VacancesData.vacances || []) {
//             if (vac.id) await updateVacances(vac.id, vac);
//             else await addVacances({ ...vac, sectionId: section.id, entrepriseId });
//         }
//
//         // 4️⃣ Fin de l’édition
//         setEditing(false);
//     };
//
//     /** ✅ Annuler les modifications locales */
//     const handleCancel = () => {
//         setVacancesData({
//             ...section,
//             newVac: { description: "", debut: "", fin: "" },
//         });
//         setDataHoraire(section.horaire || { ouverture: "", fermeture: "" });
//         setVacancesOpen(false);
//         setEditing(false);
//     };
//
//     /** ✅ Ajouter vacances */
//     const handleAddVac = async () => {
//         const vac = VacancesData.newVac;
//         if (!vac.debut || !vac.fin) return;
//         const added = await addVacances({ ...vac, sectionId: section.id, entrepriseId });
//         setVacancesData({
//             ...VacancesData,
//             vacances: [...VacancesData.vacances, added],
//             newVac: { description: "", debut: "", fin: "" },
//         });
//     };
//
//     /** ✅ Supprimer vacances */
//     const handleDeleteVac = async (id: number) => {
//         await deleteVacances(id);
//         setVacancesData({
//             ...VacancesData,
//             vacances: VacancesData.vacances.filter((v: any) => v.id !== id),
//         });
//     };
//
//     return (
//         <section className="bg-white p-6 shadow-md rounded-2xl border border-gray-200 mt-6">
//             {/* === Header === */}
//             <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold flex items-center gap-2">
//                     <Building size={20} /> {VacancesData.nom}
//                 </h3>
//                 <div className="flex gap-2">
//                     {!editing ? (
//                         <>
//                             <button
//                                 onClick={() => setEditing(true)}
//                                 className="flex items-center gap-1 text-blue-500 font-medium"
//                             >
//                                 <Edit3 size={16} /> Modifier
//                             </button>
//                             <button
//                                 onClick={() => deleteSection(section.id)}
//                                 className="flex items-center gap-1 text-red-500 font-medium"
//                             >
//                                 <Trash size={16} /> Supprimer
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <button
//                                 onClick={handleSaveSection}
//                                 className="flex items-center gap-1 text-green-500 font-medium"
//                             >
//                                 <Save size={16} /> Enregistrer
//                             </button>
//                             <button
//                                 onClick={handleCancel}
//                                 className="flex items-center gap-1 text-gray-500 font-medium"
//                             >
//                                 <X size={16} /> Annuler
//                             </button>
//                         </>
//                     )}
//                 </div>
//             </div>
//
//             {/* === Informations section === */}
//             <DynamicForm
//                 data={VacancesData}
//                 setData={setVacancesData}
//                 fields={["nom", "email", "telephone", "adresse", "ville", "codePostal", "pays"]}
//                 readOnly={!editing}
//                 fieldIcons={defaultFieldIcons}
//                 columns={3}
//             />
//
//             {/* === Horaires === */}
//             <h4 className="text-lg font-semibold flex items-center gap-2 mt-4 mb-2">
//                 <Clock size={16} /> Horaires
//             </h4>
//             <DynamicForm
//                 data={dataHoraire}
//                 setData={setDataHoraire}
//                 fields={["ouverture", "fermeture"]}
//                 fieldTypes={{ ouverture: "time", fermeture: "time" }}
//                 inline
//                 readOnly={!editing}
//             />
//
//             {/* === Vacances === */}
//             <Collapsible title="Vacances" icon={<Calendar size={18} />} open={vacancesOpen} onToggle={setVacancesOpen}>
//                 {VacancesData.vacances?.map((v: any) => (
//                     <div key={v.id} className="flex items-center gap-2 mb-2">
//                         <DynamicForm
//                             data={{
//                                 description: v.description,
//                                 debut: formatDateForInput(v.debut),
//                                 fin: formatDateForInput(v.fin),
//                             }}
//                             setData={(d) =>
//                                 setVacancesData({
//                                     ...VacancesData,
//                                     vacances: VacancesData.vacances.map((x: any) =>
//                                         x.id === v.id ? { ...x, ...d } : x
//                                     ),
//                                 })
//                             }
//                             fields={["description", "debut", "fin"]}
//                             fieldTypes={{ debut: "date", fin: "date" }}
//                             inline
//                             readOnly={!editing}
//                         />
//                         {editing && (
//                             <button onClick={() => handleDeleteVac(v.id)}>
//                                 <Trash size={16} className="text-red-500" />
//                             </button>
//                         )}
//                     </div>
//                 ))}
//                 {editing && (
//                     <div className="flex gap-2 mt-2 items-center">
//                         <DynamicForm
//                             data={VacancesData.newVac}
//                             setData={(d) => setVacancesData({ ...VacancesData, newVac: d })}
//                             fields={["description", "debut", "fin"]}
//                             fieldTypes={{ debut: "date", fin: "date" }}
//                             inline
//                         />
//                         <button onClick={handleAddVac} className="text-blue-500">
//                             <Plus size={16} />
//                         </button>
//                     </div>
//                 )}
//             </Collapsible>
//         </section>
//     );
// };
//
//
//
//
//
import React, { useEffect, useState } from "react";
import { defaultFieldIcons, DynamicForm } from "@/components/ui/DynamicForm";
import { Building, Calendar, Clock, Edit3, Plus, Save, Trash, X } from "lucide-react";
import Collapsible from "@/components/ui/Collapsible";
import formatDateForInput from "@/utils/formatDateForInput";
import { useEntreprises } from "@/context/entrepriseContext";
import { Section, Vacances, Horaire } from "@/types/entreprise";

interface SectionCardProps {
    section: Section;
    entrepriseId: number;
    updateSection: (id: number, data: Section) => Promise<void>;
    deleteSection: (id: number) => Promise<void>;
    addVacances: (data: Omit<Vacances, "id">) => Promise<Vacances>;
    updateVacances: (id: number, data: Vacances) => Promise<void>;
    deleteVacances: (id: number) => Promise<void>;
}

interface SectionWithNewVac extends Section {
    newVac: {
        description: string;
        debut: string;
        fin: string;
    };
}

export const SectionCard: React.FC<SectionCardProps> = ({
                                                            section,
                                                            entrepriseId,
                                                            updateSection,
                                                            deleteSection,
                                                            addVacances,
                                                            updateVacances,
                                                            deleteVacances,
                                                        }) => {
    const [editing, setEditing] = useState(false);
    const [VacancesData, setVacancesData] = useState<SectionWithNewVac>({
        ...section,
        newVac: { description: "", debut: "", fin: "" },
    });
    const [dataHoraire, setDataHoraire] = useState<Partial<Horaire>>({
        ouverture: "",
        fermeture: "",
    });

    const { addHoraire, updateHoraire,horaires } = useEntreprises();

    const [vacancesOpen, setVacancesOpen] = useState(false);

    /** 🔁 Synchronise les données si la section change */
    useEffect(() => {
        setVacancesData({
            ...section,
            newVac: { description: "", debut: "", fin: "" },
        });

        setDataHoraire(section.horaire || { ouverture: "", fermeture: "" });
    }, [section]);

    //TODO - problème de mise à jour des données via la base de donnée en temps réel
    /** ✅ Sauvegarde section + horaires + vacances */
    const handleSaveSection = async () => {
        if (section) {
            await updateSection(section.id, VacancesData);
        }

        // 2️⃣ Sauvegarde des horaires (création ou update)
        if (dataHoraire.id) {
          await updateHoraire(dataHoraire.id, dataHoraire as Horaire);
        } else {
            await addHoraire({
                ...(dataHoraire as Omit<Horaire, "id">),
                sectionId: section.id,
            });
        }

        // 3️⃣ Sauvegarde des vacances
        for (const vac of VacancesData.vacances ?? []) {
            if (vac.id) await updateVacances(vac.id, vac);
            else await addVacances({ ...vac, sectionId: section.id, entrepriseId });
        }

        setEditing(false);
    };

    /** ✅ Annuler les modifications locales */
    const handleCancel = () => {
        setVacancesData({
            ...section,
            newVac: { description: "", debut: "", fin: "" },
        });
        setDataHoraire(section.horaire || { ouverture: "", fermeture: "" });
        setVacancesOpen(false);
        setEditing(false);
    };

    /** ✅ Ajouter vacances */
    const handleAddVac = async () => {
        const vac = VacancesData.newVac;
        if (!vac.debut || !vac.fin) return;
        const added = await addVacances({ ...vac, sectionId: section.id, entrepriseId });
        setVacancesData((prev) => ({
            ...prev,
            vacances: [...(prev.vacances ?? []), added],
            newVac: { description: "", debut: "", fin: "" },
        }));
    };

    /** ✅ Supprimer vacances */
    const handleDeleteVac = async (id: number) => {
        await deleteVacances(id);
        setVacancesData((prev) => ({
            ...prev,
            vacances: (prev.vacances ?? []).filter((v) => v.id !== id),
        }));
    };

    return (
        <section className="bg-white p-6 shadow-md rounded-2xl border border-gray-200 mt-6">
            {/* === Header === */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Building size={20} /> {VacancesData.nom}
                </h3>
                <div className="flex gap-2">
                    {!editing ? (
                        <>
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1 text-blue-500 font-medium"
                            >
                                <Edit3 size={16} /> Modifier
                            </button>
                            <button
                                onClick={() => deleteSection(section.id)}
                                className="flex items-center gap-1 text-red-500 font-medium"
                            >
                                <Trash size={16} /> Supprimer
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveSection}
                                className="flex items-center gap-1 text-green-500 font-medium"
                            >
                                <Save size={16} /> Enregistrer
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-1 text-gray-500 font-medium"
                            >
                                <X size={16} /> Annuler
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* === Informations section === */}
            <DynamicForm
                data={VacancesData}
                setData={setVacancesData}
                fields={["nom", "email", "telephone", "adresse", "ville", "codePostal", "pays"]}
                readOnly={!editing}
                fieldIcons={defaultFieldIcons}
                columns={3}
            />

            {/* === Horaires === */}
            <h4 className="text-lg font-semibold flex items-center gap-2 mt-4 mb-2">
                <Clock size={16} /> Horaires
            </h4>
            <DynamicForm
                data={dataHoraire}
                setData={setDataHoraire}
                fields={["ouverture", "fermeture"]}
                fieldTypes={{ ouverture: "time", fermeture: "time" }}
                inline
                readOnly={!editing}
            />

            {/* === Vacances === */}
            <Collapsible
                title="Vacances"
                icon={<Calendar size={18} />}
                open={vacancesOpen}
                onToggle={setVacancesOpen}
            >
                {(VacancesData.vacances ?? []).map((v) => (
                    <div key={v.id} className="flex items-center gap-2 mb-2">
                        <DynamicForm
                            data={{
                                description: v.description,
                                debut: formatDateForInput(v.debut),
                                fin: formatDateForInput(v.fin),
                            }}
                            setData={(d) =>
                                setVacancesData((prev) => ({
                                    ...prev,
                                    vacances: (prev.vacances ?? []).map((x) =>
                                        x.id === v.id ? { ...x, ...d } : x
                                    ),
                                }))
                            }
                            fields={["description", "debut", "fin"]}
                            fieldTypes={{ debut: "date", fin: "date" }}
                            inline
                            readOnly={!editing}
                        />
                        {editing && (
                            <button onClick={() => handleDeleteVac(v.id)}>
                                <Trash size={16} className="text-red-500" />
                            </button>
                        )}
                    </div>
                ))}
                {editing && (
                    <div className="flex gap-2 mt-2 items-center">
                        <DynamicForm
                            data={VacancesData.newVac}
                            setData={(d) => setVacancesData((prev) => ({ ...prev, newVac: d }))}
                            fields={["description", "debut", "fin"]}
                            fieldTypes={{ debut: "date", fin: "date" }}
                            inline
                        />
                        <button onClick={handleAddVac} className="text-blue-500">
                            <Plus size={16} />
                        </button>
                    </div>
                )}
            </Collapsible>
        </section>
    );
};