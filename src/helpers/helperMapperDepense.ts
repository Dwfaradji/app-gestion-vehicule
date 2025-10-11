import type { Item } from "@/types/entretien";
import type { Depense } from "@/types/depenses";

export const mapDepenseToItem = (d: Depense): Item => ({
  id: d.id,
  categorie: d.categorie,
  reparation: d.reparation,
  date: d.date,
  km: d.km,
  intervenant: d.intervenant || "",
  note: d.note || "",
  montant: d.montant,
  itemId: 0, // ajouté manuellement
});
