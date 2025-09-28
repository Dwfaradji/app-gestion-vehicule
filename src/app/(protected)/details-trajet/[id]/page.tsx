'use client'
import React, { useEffect, useState } from 'react';
import { Notification } from "@/types/entretien";
import {DetailTrajetPage} from "@/components/Accueil/DetailTrajet";
import {useVehicules} from "@/context/vehiculesContext";


const Page = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const {vehicules}= useVehicules();

    useEffect(() => {


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
            />
        </div>
    );
};

export default Page;