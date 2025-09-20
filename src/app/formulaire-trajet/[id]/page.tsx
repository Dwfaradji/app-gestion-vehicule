'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import FormulaireTrajet from '@/components/Accueil/FormulaireTrajet';
import { Vehicule } from '@/types/vehicule';

interface Conducteur {
    id: number;
    nom: string;
    prenom: string;
    code: string;
    vehiculeId?: number;
}

interface Trajet {
    vehiculeId: number;
    conducteurId: number;
    depart?: {
        km: number;
        heure: string;
        destination: string;
        carburant: number;
        anomalie: string;
    };
    arrivee?: {
        km: number;
        heure: string;
        destination: string;
        carburant: number;
        anomalie: string;
    };
}

const Page = () => {
    const { id: vehiculeIdParam } = useParams<{ id: string }>();
    const vehiculeId = vehiculeIdParam ? Number(vehiculeIdParam) : null;

    const [vehicules] = useState<Vehicule[]>([
        { id: 1, type: 'Voiture', constructeur: 'Renault', modele: 'Clio', annee: 2021, energie: 'Essence', km: 12000, statut: 'Disponible', dateEntretien: '2024-01-01', prochaineRevision: '2025-01-01', immat: 'AB-123-CD', ctValidite: '2025-06-01' },
        { id: 2, type: 'Camion', constructeur: 'Mercedes', modele: 'Sprinter', annee: 2020, energie: 'Diesel', km: 55000, statut: 'Disponible', dateEntretien: '2024-02-01', prochaineRevision: '2025-02-01', immat: 'EF-456-GH', ctValidite: '2025-07-01' },
    ]);

    const [conducteurs] = useState<Conducteur[]>([
        { id: 1, nom: 'Dupont', prenom: 'Paul', code: 'ABC123', vehiculeId: 1 },
        { id: 2, nom: 'Martin', prenom: 'Julie', code: 'XYZ789', vehiculeId: 2 },
    ]);

    const [trajets, setTrajets] = useState<Trajet[]>([]);

    const vehicule = vehicules.find((v) => v.id === vehiculeId);
    const conducteur = conducteurs.find((c) => c.vehiculeId === vehiculeId);

    const trajet = trajets.find((t) => t.vehiculeId === vehiculeId && t.conducteurId === conducteur?.id);
    const departFait = !!trajet?.depart;
    const arriveeFait = !!trajet?.arrivee;

    const handleSubmit = (data: any) => {
        setTrajets((prev) => {
            const existing = prev.find((t) => t.vehiculeId === data.vehiculeId && t.conducteurId === data.conducteurId);

            if (existing) {
                if (data.type === 'depart') existing.depart = { ...data };
                if (data.type === 'arrivee') existing.arrivee = { ...data };
                return [...prev];
            } else {
                return [
                    ...prev,
                    data.type === 'depart'
                        ? { vehiculeId: data.vehiculeId, conducteurId: data.conducteurId, depart: { ...data } }
                        : { vehiculeId: data.vehiculeId, conducteurId: data.conducteurId, arrivee: { ...data } },
                ];
            }
        });
    };

    if (!vehicule) return <p>Véhicule introuvable</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <FormulaireTrajet vehicule={vehicule} conducteur={conducteur} maxAttempts={5} onSubmit={handleSubmit} />
            {departFait && !arriveeFait && <p className="mt-2 text-green-600">Départ enregistré. Vous pouvez maintenant saisir l'arrivée.</p>}
            {arriveeFait && <p className="mt-2 text-blue-600">Arrivée enregistrée. Merci ! Le formulaire est réinitialisé pour un nouveau conducteur.</p>}
        </div>
    );
};

export default Page;