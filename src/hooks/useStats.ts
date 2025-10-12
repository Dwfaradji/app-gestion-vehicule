"use client";

import { useMemo } from "react";
import type { CardProps } from "@/components/ui/Cards";

interface Metric<T> {
    /** Libellé affiché sur la carte */
    label: string;
    /** Fonction de calcul de la valeur à partir des données */
    value: (items: T[]) => number | string;
    /** Couleur de la carte */
    color: CardProps["color"];
    /** Icône de la carte */
    icon: CardProps["icon"];
}

interface UseStatsProps<T> {
    /** Tableau de données source */
    data: T[];
    /** Tableau des métriques à calculer */
    metrics: Metric<T>[];
}

/**
 * Hook générique pour calculer des statistiques sur n'importe quel type de tableau de données.
 * Retourne un tableau compatible avec <Totaux />.
 */
export default function useStats<T>({ data, metrics }: UseStatsProps<T>): CardProps[] {
    return useMemo(() => {
        return metrics.map((metric) => ({
            label: metric.label,
            value: metric.value(data),
            color: metric.color,
            icon: metric.icon,
        }));
    }, [data, metrics]);
}