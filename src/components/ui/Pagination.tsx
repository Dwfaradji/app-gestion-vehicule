"use client";

import React, { useState, useEffect } from "react";

interface PaginationProps<T> {
    data: T[]; // toutes les données à paginer
    itemsPerPage?: number; // items par page (par défaut 10)
    onPageChange: (pageData: T[]) => void; // callback avec les éléments de la page courante
    maxButtons?: number; // nombre maximum de boutons visibles
}

export default function Pagination<T>({
                                          data,
                                          itemsPerPage = 10,
                                          onPageChange,
                                          maxButtons = 5,
                                      }: PaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

    // Met à jour les éléments de la page courante
    useEffect(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        onPageChange(data.slice(start, end));
    }, [currentPage, data, itemsPerPage, onPageChange]);

    // Calcul des boutons visibles
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Prev
            </button>

            {startPage > 1 && <span className="px-2">...</span>}

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 border rounded ${p === currentPage ? "bg-blue-600 text-white" : ""}`}
                >
                    {p}
                </button>
            ))}

            {endPage < totalPages && <span className="px-2">...</span>}

            <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}