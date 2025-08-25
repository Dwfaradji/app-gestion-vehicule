// "use client";
// import React from "react";
// import FormulaireItem from "@/components/FormulaireAdd";
// import { Item } from "@/types/entretien";
//
// interface Props {
//     form: Item;
//     setForm: (form: Item) => void;
//     handleAddItem: (item: Item) => void;
//     showForm: boolean;
//     setShowForm: (show: boolean) => void;
//     activeTab: "Mécanique" | "Carrosserie" | "Révision";
//     intervenant: string[];
// }
//
// export default function FormulaireVehiculeTab({ form, setForm, handleAddItem, showForm, setShowForm, activeTab, intervenant }: Props) {
//     if (!showForm)
//         return (
//             <button
//                 onClick={() => setShowForm(true)}
//                 className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 mb-4"
//             >
//                 + Ajouter
//             </button>
//         );
//
//     return (
//         <FormulaireItem
//             form={form}
//             setForm={setForm}
//             handleAddItem={() => handleAddItem({ ...form, categorie: activeTab })}
//             setShowForm={setShowForm}
//             options={{ intervenant, kmPlaceholder: "Kilométrage", activeTab }}
//         />
//     );
// }