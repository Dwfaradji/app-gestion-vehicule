import React from 'react';
interface FiltersProps {
    search: string;
    setSearch: (value: string) => void;
    filterType: string | null;
    setFilterType: (value: string | null) => void;
}
const SearchBar = ({ search, setSearch, filterType, setFilterType }: FiltersProps) => {
    const types = ["Utilitaire", "Berline", "SUV"];
    return (
        <div className="mb-4 flex flex-wrap items-center gap-3">
            <input
                type="text"
                placeholder="Rechercher véhicule..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={() => setFilterType(null)}
                className={`rounded-full border px-3 py-1 text-sm ${filterType === null ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
                Tout
            </button>
            {types.map((t) => (
                <button
                    key={t}
                    onClick={() => setFilterType(filterType === t ? null : t)}
                    className={`rounded-full border px-3 py-1 text-sm ${filterType === t ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                    {t}
                </button>
            ))}
        </div>
    );
};

export default SearchBar;