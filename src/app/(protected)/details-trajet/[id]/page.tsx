"use client";
import React, { useEffect, useState } from "react";
import type { Notification } from "@/types/entretien";
import { DetailTrajetPage } from "@/components/trajets/DetailTrajet";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import Loader from "@/components/layout/Loader";

const Page = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isLoading = useGlobalLoading();

  useEffect(() => {
    setNotifications(notifications);
  }, [notifications]);

  if (isLoading) {
    return <Loader message={"Chargement du trajet..."} isLoading={isLoading} fullscreen />;
  }

  return (
    <div className="p-6">
      <DetailTrajetPage />
    </div>
  );
};

export default Page;
