import { Vehicule} from "@/types/vehicule";

export const mockVehicules: Vehicule[] = [
    {
        id: 1,
        type: "Utilitaire",
        modele: "Renault Kangoo",
        immat: "AA-123-BB",
        vim: "VF1FC1J0631234567",
        annee: 2019,
        energie: "Diesel",
        km: 84210,
        prixAchat: 12500,
        statut: "Disponible",
        dateEntretien: "2025-01-15",
        prochaineRevision: "2025-09-10",
        ctValidite: "2026-02-15",

        mecanique: [
            { reparations: "Vidange", date: "2025-01-15", km: 83000, prestataire: "Norauto", note: "RAS", type: "Mécanique" },
            { reparations: "Freins avant", date: "2024-08-20", km: 80000, prestataire: "Renault Service", note: "Usure 80%", type: "Mécanique" },
        ],

        carrosserie: [
            { reparations: "Pare-chocs", date: "2024-05-10", km: 75000, prestataire: "Peugeot Pro", note: "Choc mineur", type: "Carrosserie" },
        ],

        revision: [
            { reparations: "Filtres", date: "2024-12-01", km: 82000, prestataire: "Norauto", note: "", type: "Entretien" },
        ],

        depenses: [
            { mois: "Janv", carrosserie: 120, mécanique: 300, révision: 200 },
            { mois: "Fév", carrosserie: 80, mécanique: 280, révision: 150 },
            { mois: "Mars", carrosserie: 100, mécanique: 310, révision: 100 },
        ],
    },
    {
        id: 2,
        type: "Berline",
        modele: "Peugeot 308",
        immat: "BC-456-CD",
        vim: "VF3LPHNSQ12398765",
        annee: 2021,
        energie: "Essence",
        km: 12010,
        prixAchat: 21500,
        statut: "Incident",
        dateEntretien: "2024-11-05",
        prochaineRevision: "2025-08-25",
        ctValidite: "2024-11-01",

        mecanique: [
            { reparations: "Suspension", date: "2024-07-10", km: 11000, prestataire: "Paul", note: "Amortisseurs faibles", type: "Mécanique" },
        ],

        carrosserie: [],

        revision: [
            { reparations: "Climatisation", date: "2025-01-10", km: 11500, prestataire: "Jonny", note: "", type: "Entretien" },
        ],

        depenses: [
            { mois: "Janv", carrosserie: 120, mécanique: 300, révision: 200 },
            { mois: "Fév", carrosserie: 80, mécanique: 280, révision: 150 },
            { mois: "Mars", carrosserie: 100, mécanique: 310, révision: 100 },
        ],
    },
    {
        id: 3,
        type: "SUV",
        modele: "Tesla Model Y",
        immat: "FG-321-GH",
        vim: "5YJYGDEF9LF012345",
        annee: 2022,
        energie: "Électrique",
        km: 28190,
        prixAchat: 52000,
        statut: "Disponible",
        dateEntretien: "2025-02-01",
        prochaineRevision: "2025-12-05",
        ctValidite: "2025-12-05",

        mecanique: [],

        carrosserie: [
            { reparations: "Peinture", date: "2024-09-15", km: 20000, prestataire: "Tesla Center", note: "Rayures portière", type: "Carrosserie" },
        ],

        revision: [
            { reparations: "Révision générale", date: "2025-01-20", km: 27000, prestataire: "Tesla Center", note: "RAS", type: "Entretien" },
        ],

        depenses: [
            { mois: "Janv", carrosserie: 120, mécanique: 300, révision: 200 },
            { mois: "Fév", carrosserie: 80, mécanique: 280, révision: 150 },
            { mois: "Mars", carrosserie: 100, mécanique: 310, révision: 100 },
        ],
    },
];