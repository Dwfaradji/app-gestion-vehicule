"use client";

import Loader from "@/components/layout/Loader";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

export default function Loading() {
  const isLoading = useGlobalLoading();

  return <Loader message={"Chargement de l'application..."} isLoading={isLoading} fullscreen />;
}
