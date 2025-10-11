// "use client";
//
// import React, { useState } from "react";
// import { motion } from "framer-motion";
//
// interface Column<T> {
//   key: keyof T | string;
//   label: string;
//   render?: (item: T, isEditing: boolean, onChange: (value: any) => void) => React.ReactNode;
//   editable?: boolean;
//   align?: "left" | "center" | "right";
//   width?: string;
// }
//
// interface TableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   onRowClick?: (item: T) => void;
//   onSave?: (updatedRow: T) => void;
//   emptyMessage?: string;
//   responsive?: boolean;
// }
//
// export default function TableEd itable<T extends { id: number }>({
//   data,
//   columns,
//   onRowClick,
//   onSave,
//   emptyMessage = "Aucune donnée disponible",
//   responsive = true,
// }: TableProps<T>) {
//   const [editingRow, setEditingRow] = useState<number | null>(null);
//   const [editValues, setEditValues] = useState<Partial<T>>({});
//
//   const startEditing = (row: T) => {
//     setEditingRow(row.id);
//     setEditValues(row);
//   };
//
//   const cancelEditing = () => {
//     setEditingRow(null);
//     setEditValues({});
//   };
//
//   const saveEditing = () => {
//     if (editingRow === null) return;
//     if (onSave) onSave(editValues as T);
//     setEditingRow(null);
//     setEditValues({});
//   };
//
//   const handleChange = (key: keyof T, value: any) => {
//     setEditValues((prev) => ({ ...prev, [key]: value }));
//   };
//
//   return (
//     <div
//       className={`rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden ${
//         responsive ? "overflow-x-auto" : ""
//       }`}
//     >
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             {columns.map((col) => (
//               <th
//                 key={String(col.key)}
//                 className={`px-4 py-3 text-xs font-semibold uppercase text-gray-500 text-${col.align || "left"}`}
//                 style={{ width: col.width }}
//               >
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//
//         <tbody className="divide-y divide-gray-100">
//           {data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={columns.length + (onSave ? 1 : 0)}
//                 className="py-6 text-center text-gray-400 text-sm"
//               >
//                 {emptyMessage}
//               </td>
//             </tr>
//           ) : (
//             data.map((item) => {
//               const isEditing = editingRow === item.id;
//               return (
//                 <motion.tr
//                   key={item.id}
//                   onClick={() => onRowClick?.(item)}
//                   className={`${onRowClick ? "cursor-pointer hover:bg-blue-50 transition" : ""}`}
//                   initial={{ opacity: 0, y: -5 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {columns.map((col) => (
//                     <td
//                       key={String(col.key)}
//                       className={`px-4 py-3 text-sm text-gray-700 text-${col.align || "left"}`}
//                     >
//                       {col.render ? (
//                         col.render(item, isEditing, (v: any) => handleChange(col.key as keyof T, v))
//                       ) : isEditing && col.editable ? (
//                         <input
//                           type="text"
//                           value={(editValues[col.key as keyof T] as any) ?? ""}
//                           onChange={(e) => handleChange(col.key as keyof T, e.target.value)}
//                           className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
//                         />
//                       ) : (
//                         String(item[col.key as keyof T] ?? "-")
//                       )}
//                     </td>
//                   ))}
//                 </motion.tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
