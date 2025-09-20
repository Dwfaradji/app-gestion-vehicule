'use client'
import React, { useEffect, useState } from 'react';
import DetailTrajet from "@/components/Accueil/DetailTrajet";
import { Vehicule } from "@/types/vehicule";
import { Notification } from "@/types/entretien";
import DetailTrajetPage from "@/components/Accueil/DetailTrajet";

interface Conducteur {
    id: number;
    nom: string;
    prenom: string;
}

const Page = () => {
    const [vehicules, setVehicules] = useState<Vehicule[]>([]);
    const [conducteurs, setConducteurs] = useState<Conducteur[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Mock véhicules
        const mockVehicules: Vehicule[] = [
            {
                id: 1,
                type: "Voiture",
                modele: "Clio",
                energie: "Essence",
                immat: "AB-123-CD",
                statut: "Disponible",
                km: 12000,
                constructeur: '',
                annee: 0,
                dateEntretien: '',
                prochaineRevision: '',
                ctValidite: ''
            },
            { id: 2, type: "Camion", modele: "Master", energie: "Diesel", immat: "EF-456-GH", statut: "Occupé", km: 55000 },
        ];
        setVehicules(mockVehicules);

        // Mock conducteurs
        const mockConducteurs: Conducteur[] = [
            { id: 1, nom: "Dupont", prenom: "Paul" },
            { id: 2, nom: "Martin", prenom: "Julie" },
        ];
        setConducteurs(mockConducteurs);

        // Mock notifications
        const mockNotifications: Notification[] = [
            { id: 1, vehicleId: 2, message: "Vidange à effectuer", priority: "urgent", date: new Date().toISOString(), _new: true, seen: false },
        ];
        setNotifications(mockNotifications);
    }, []);


    return (
        <div className="p-6">
            <DetailTrajetPage
                vehicules={vehicules}
                conducteurs={conducteurs}
            />
        </div>
    );
};

export default Page;