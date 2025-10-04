import Loader from "@/components/layout/Loader";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader message="Chargement de la page..." />
        </div>
    );
}