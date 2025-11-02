// "use client";
//
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import FormField from "@/components/ui/FormField";
// import type { Conducteur, Trajet } from "@/types/trajet";
//
// interface FormulaireTrajetProps {
//   initialData: Partial<Trajet>;
//   conducteurs: Conducteur[];
//   onSave: (data: Partial<Trajet>) => void;
//   onCancel: () => void;
// }
//
// interface FieldConfig<T extends keyof Trajet = keyof Trajet> {
//   label: string;
//   field: T;
//   type?: "text" | "number" | "select" | "date" | "time";
//   options?: { label: string; value: string | number }[];
// }
//
// export default function FormulaireTrajet({
//   initialData,
//   conducteurs,
//   onSave,
//   onCancel,
// }: FormulaireTrajetProps) {
//   const [form, setForm] = useState<Partial<Trajet>>(initialData);
//
//   const handleChange = <K extends keyof Trajet>(field: K, value: Trajet[K] | string | number) => {
//     // Si c’est le conducteur, s’assurer d’avoir un number
//     if (field === "conducteurId" && typeof value === "string") {
//       value = Number(value) as Trajet[K];
//     }
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };
//
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.conducteurId) {
//       alert("Veuillez sélectionner un conducteur avant d’enregistrer le trajet.");
//       return;
//     }
//     onSave(form);
//   };
//
//   const fields: FieldConfig[] = [
//     {
//       label: "Conducteur",
//       field: "conducteurId",
//       type: "select",
//       options: [
//         { label: "-- Sélectionner un conducteur --", value: 0 },
//         ...conducteurs.map((c) => ({
//           label: `${c.prenom} ${c.nom}`,
//           value: c.id ?? 0, // ⚡️ fallback pour éviter undefined
//         })),
//       ],
//     },
//     { label: "Destination", field: "destination", type: "text" },
//     { label: "Km départ", field: "kmDepart", type: "number" },
//     { label: "Km arrivée", field: "kmArrivee", type: "number" },
//     { label: "Heure départ", field: "heureDepart", type: "time" },
//     { label: "Heure arrivée", field: "heureArrivee", type: "time" },
//     { label: "Carburant (%)", field: "carburant", type: "number" },
//   ];
//
//   return (
//     <motion.form
//       onSubmit={handleSubmit}
//       initial={{ opacity: 0, y: -15 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -15 }}
//       transition={{ duration: 0.3 }}
//       className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6 max-w-3xl mx-auto"
//     >
//       <h3 className="text-xl font-semibold text-gray-800 mb-2">Nouveau trajet</h3>
//
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {fields.map((f) => (
//           <FormField
//             key={f.field as string}
//             label={f.label}
//             type={f.type}
//             value={(form[f.field] as string | number) ?? null} // <-- cast et fallback null
//             onChange={(val) => {
//               // Forcer val à string | number
//               if (Array.isArray(val)) {
//                 val = val[0]; // si jamais c'est un tableau, prend juste le 1er
//               }
//               handleChange(f.field, val as string | number);
//             }}
//             options={f.options}
//           />
//         ))}
//       </div>
//
//       <div className="flex justify-end gap-3 pt-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
//         >
//           Annuler
//         </button>
//         <button
//           type="submit"
//           className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
//         >
//           Enregistrer
//         </button>
//       </div>
//     </motion.form>
//   );
// }
