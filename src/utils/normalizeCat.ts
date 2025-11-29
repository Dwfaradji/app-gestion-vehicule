// Supprime les accents et met en minuscule et supprime les espaces met en majuscule
export const normalizeCat = (cat?: string, toUpperCase?: boolean) => {
  if (toUpperCase) {
    return (cat || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "")
      .trim()
      .toUpperCase();
  }
  (cat || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
};
