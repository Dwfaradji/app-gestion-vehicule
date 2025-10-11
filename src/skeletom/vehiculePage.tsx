"use client";

export default function VehiculeSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Gestion des véhicules
      </h1>

      <div className="space-y-6">
        {/* Cartes d'information */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 w-48 h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse opacity-50"></div>
          <div className="flex-1 w-36 h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse opacity-50"></div>
          <div className="flex-1 w-44 h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse opacity-50"></div>
          <div className="flex-1 w-40 h-20 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse opacity-50"></div>
        </div>

        {/* Filtres et boutons */}
        <div className="space-y-3">
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-10 w-[120px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-[80px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-[100px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-[90px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-[110px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-[130px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Section résumé */}
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-6 w-15 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-6 w-25 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-6 w-30 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 uppercase text-xs">
              <tr>
                {Array.from({ length: 15 }).map((_, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-[${16 + i * 2}px]`}
                  ></th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                >
                  {Array.from({ length: 15 }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-4 py-3 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-[${16 + colIndex * 2}px]`}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-2 py-4">
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
