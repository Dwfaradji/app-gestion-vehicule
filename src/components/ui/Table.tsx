"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

export interface Column<T> {
    key?: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    align?: "left" | "center" | "right";
    width?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    responsive?: boolean;
    footer?: Partial<T>;
}

export default function Table<T>({
                                     data,
                                     columns,
                                     onRowClick,
                                     emptyMessage = "Aucune donnée disponible",
                                     responsive = true,
                                     footer,
                                 }: TableProps<T>) {
    const [visibleData, setVisibleData] = useState<T[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);

    // --- Chargement initial
    useEffect(() => {
        const initial = data.slice(0, pageSize);
        setVisibleData(initial);
        setHasMore(initial.length < data.length);
    }, [data, pageSize]);

    // --- Load more
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        setTimeout(() => {
            setVisibleData((prev) => {
                const nextItems = data.slice(prev.length, prev.length + pageSize);
                const allData = [...prev, ...nextItems];
                setHasMore(allData.length < data.length);
                return allData;
            });
            setLoadingMore(false);
        }, 600);
    }, [data, pageSize, loadingMore, hasMore]);

    // --- Observer pour scroll infini
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) loadMore();
            },
            { root: null, rootMargin: "100px", threshold: 0.1 }
        );

        if (loaderRef.current && hasMore) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loadMore, hasMore]);

    // --- Skeleton loader
    const skeletonRows = Array.from({ length: pageSize }).map((_, idx) => (
        <tr key={`skeleton-${idx}`} className="animate-pulse">
            {columns.map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded-full w-3/4 dark:bg-gray-700"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-1/2 dark:bg-gray-700"></div>
                    </div>
                </td>
            ))}
        </tr>
    ));

    return (
        <div className="space-y-4">
            {/* Sélecteur */}
            {data.length > 10 && (
                <div className="flex items-center justify-end mb-2">
                    <label className="text-sm text-gray-600 mr-2">Afficher :</label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setPageSize(value);
                            setVisibleData(data.slice(0, value));
                            setHasMore(value < data.length);
                        }}
                        className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                        {[10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Table */}
            <div
                className={`rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden ${
                    responsive ? "overflow-x-auto" : ""
                }`}
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className={`px-4 py-3 text-xs font-semibold uppercase text-gray-500 tracking-wider text-${
                                    col.align || "left"
                                }`}
                                style={{ width: col.width }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                    {visibleData.map((item, idx) => (
                        <tr
                            key={idx}
                            onClick={() => onRowClick?.(item)}
                            className={`${onRowClick ? "cursor-pointer hover:bg-blue-50" : ""}`}
                        >
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className={`px-4 py-3 text-sm text-gray-700 text-${col.align || "left"}`}
                                >
                                    {col.render ? col.render(item) : col.key ? String(item[col.key as keyof T] ?? "-") : "-"}
                                </td>
                            ))}
                        </tr>
                    ))}

                    {loadingMore && skeletonRows}
                    </tbody>

                    {footer && (
                        <tfoot className="bg-gray-100 font-semibold">
                        <tr className="border-t border-gray-300">
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className={`px-4 py-3 text-sm text-gray-700 text-${col.align || "left"}`}
                                >
                                    {col.key ? String(footer[col.key as keyof T] ?? "") : ""}
                                </td>
                            ))}
                        </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* Loader Scroll */}
            {hasMore && !loadingMore && (
                <div ref={loaderRef} className="flex justify-center items-center py-6">
                    <div className="text-gray-500 text-sm">Défilez pour charger plus...</div>
                </div>
            )}
        </div>
    );
}