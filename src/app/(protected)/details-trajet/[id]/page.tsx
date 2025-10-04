'use client'
import React, { useEffect, useState } from 'react';
import { Notification } from "@/types/entretien";
import {DetailTrajetPage} from "@/components/Accueil/DetailTrajet";
import {useVehicules} from "@/context/vehiculesContext";
import {useGlobalLoading} from "@/hooks/useGlobalLoading";
import Loader from "@/components/layout/Loader";


const Page = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const {vehicules}= useVehicules();
    const isLoading = useGlobalLoading();

    useEffect(() => {


        // Mock notifications
        const mockNotifications: Notification[] = [
            { id: 1, vehicleId: 2, message: "Vidange à effectuer", priority: "urgent", date: new Date().toISOString(), _new: true, seen: false },
        ];
        setNotifications(mockNotifications);
    }, []);

    if (isLoading) {
        return <Loader message={"Chargement du trajet..." } isLoading={isLoading} fullscreen/>
    }


    return (
        <div className="p-6">
            <DetailTrajetPage
                vehicules={vehicules}
            />
        </div>
    );
};

export default Page;