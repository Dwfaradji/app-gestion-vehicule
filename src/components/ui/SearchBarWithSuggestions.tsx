// "use client";
//
// import React, { useState, useRef, useMemo } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Search, X } from "lucide-react";
// import type { Vehicule } from "@/types/vehicule";
// import type { Trajet } from "@/types/trajet";
//
// interface SearchBarWithSuggestionsProps {
//   vehicules: Vehicule[];
//   trajets: Trajet[];
//   conducteurs: { id: number; nom: string; prenom: string }[];
//   search: string;
//   setSearch: (value: string) => void;
//   filterType: string | null;
//   setFilterType: (value: string | null) => void;
//   onSelectSuggestion?: (trajetId: number) => void;
// }
//
// export default function SearchBarWithSuggestions({
//   vehicules,
//   trajets,
//   conducteurs,
//   search,
//   setSearch,
//   filterType,
//   setFilterType,
//   onSelectSuggestion,
// }: SearchBarWithSuggestionsProps) {
//   const [isFocused, setIsFocused] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const types = ["Utilitaire", "Berline", "SUV"];
//
//   // ✅ Suggestions calculées avec useMemo
//   const suggestions = useMemo(() => {
//     if (!search) return [];
//     const text = search.toLowerCase();
//     return trajets
//       .filter((t) => {
//         const vehiculeT = vehicules.find((v) => v.id === t.vehiculeId);
//         const conducteur = conducteurs.find((c) => c.id === t.conducteurId);
//
//         const matchesType = filterType ? vehiculeT?.type === filterType : true;
//         const matchesText =
//           vehiculeT?.modele.toLowerCase().includes(text) ||
//           vehiculeT?.immat.toLowerCase().includes(text) ||
//           conducteur?.nom.toLowerCase().includes(text) ||
//           conducteur?.prenom.toLowerCase().includes(text) ||
//           t.destination?.toLowerCase().includes(text);
//
//         return matchesType && matchesText;
//       })
//       .slice(0, 5); // max 5 suggestions
//   }, [search, filterType, vehicules, trajets, conducteurs]);
//
//   // Fermer le dropdown si clic à l’extérieur
//   React.useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
//         setIsFocused(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//
//   const clearSearch = () => {
//     setSearch("");
//     setFilterType(null);
//   };
//
//   return (
//     <div ref={containerRef} className="relative w-full max-w-5xl mx-auto mb-6">
//       <div
//         className={`flex items-center border rounded-xl px-4 py-2 shadow-sm transition-all duration-200 ${
//           isFocused ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
//         } bg-white`}
//       >
//         <Search className="w-5 h-5 text-gray-500 mr-2" />
//         <input
//           type="text"
//           placeholder="Rechercher véhicule, conducteur ou destination..."
//           value={search}
//           onFocus={() => setIsFocused(true)}
//           onChange={(e) => setSearch(e.target.value)}
//           className="flex-1 outline-none bg-transparent text-sm text-gray-700"
//         />
//         {search && (
//           <button
//             onClick={clearSearch}
//             className="p-1 rounded-full hover:bg-gray-100 transition"
//             title="Effacer"
//           >
//             <X className="w-4 h-4 text-gray-500" />
//           </button>
//         )}
//       </div>
//
//       {/* Filtres par type */}
//       <div className="flex flex-wrap items-center gap-2 mt-2">
//         <button
//           onClick={() => setFilterType(null)}
//           className={`px-3 py-1 text-sm font-medium rounded-full border transition ${
//             filterType === null
//               ? "bg-blue-600 text-white border-blue-600"
//               : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//           }`}
//         >
//           Tous les types
//         </button>
//         {types.map((t) => (
//           <button
//             key={t}
//             onClick={() => setFilterType(filterType === t ? null : t)}
//             className={`px-3 py-1 text-sm font-medium rounded-full border transition ${
//               filterType === t
//                 ? "bg-blue-600 text-white border-blue-600"
//                 : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>
//
//       {/* Dropdown suggestions */}
//       <AnimatePresence>
//         {isFocused && suggestions.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: -5 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -5 }}
//             className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden"
//           >
//             {suggestions.map((s) => {
//               const vehiculeT = vehicules.find((v) => v.id === s.vehiculeId);
//               const conducteur = conducteurs.find((c) => c.id === s.conducteurId);
//               return (
//                 <div
//                   key={s.id}
//                   className="p-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center text-sm"
//                   onClick={() => {
//                     setSearch(`${vehiculeT?.modele} - ${s.destination}`);
//                     setIsFocused(false);
//                     onSelectSuggestion?.(s.id);
//                   }}
//                 >
//                   <span>
//                     {vehiculeT?.modele} ({vehiculeT?.immat}) - {s.destination}
//                   </span>
//                   <span className="text-gray-500">
//                     {conducteur ? `${conducteur.prenom} ${conducteur.nom}` : "-"}
//                   </span>
//                 </div>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//
//       {isFocused && suggestions.length === 0 && search && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="absolute top-full left-0 w-full mt-2 p-2 border border-gray-300 bg-white text-gray-500 rounded-lg shadow-lg"
//         >
//           Aucun résultat
//         </motion.div>
//       )}
//     </div>
//   );
// }
