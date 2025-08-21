// data/mockUtilisateurs.ts

export interface Utilisateur {
    id: number;
    nom: string;
    fonction: string;
    date: string; // date de création ou d'inscription
}

export const mockUtilisateurs: Utilisateur[] = [
    {
        id: 1,
        nom: "Alice Martin",
        fonction: "Mécano",
        date: "2025-01-03",
    },
    {
        id: 2,
        nom: "Karim Ben",
        fonction: "Admin",
        date: "2025-02-15",
    },
    {
        id: 3,
        nom: "Lucie Poirier",
        fonction: "Gestionnaire",
        date: "2025-03-10",
    },
    {
        id: 4,
        nom: "Paul Durand",
        fonction: "Technicien",
        date: "2025-04-22",
    },
    {
        id: 5,
        nom: "Jonny Smith",
        fonction: "Mécano",
        date: "2025-05-05",
    },
];