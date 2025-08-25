import {Item} from "@/types/entretien";

export const mapDepenseToItem = (d: Item): Item => ({
    id: d.id,
    categorie: d.categorie,
    reparation: d.reparation,
    date: d.date,
    km: d.km,
    intervenant: d.intervenant || "",
    note: d.note || "",
    montant: d.montant,
});