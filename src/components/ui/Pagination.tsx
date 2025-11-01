"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps<T> {
  data: T[];
  itemsPerPage?: number;
  onPageChange: (pageData: T[]) => void;
}

export default function Pagination<T>({
  data,
  itemsPerPage = 10,
  onPageChange,
}: InfiniteScrollProps<T>) {
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Met à jour les éléments affichés
  useEffect(() => {
    const end = page * itemsPerPage;
    onPageChange(data.slice(0, end));
  }, [page, data, itemsPerPage, onPageChange]);

  // IntersectionObserver pour détecter le scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && page * itemsPerPage < data.length) {
        setPage((p) => p + 1);
      }
    },
    [page, itemsPerPage, data.length],
  );

  useEffect(() => {
    const currentRef = observerRef.current; // 🔹 copie locale
    if (!currentRef) return;

    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef); // 🔹 utilise la copie locale
    };
  }, [handleObserver]);

  return <div ref={observerRef} />;
}
