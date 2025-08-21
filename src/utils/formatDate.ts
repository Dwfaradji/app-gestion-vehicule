// src/utils/formatDate.ts
export const formatDate = (dateString: string | Date, withTime = false): string => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
};