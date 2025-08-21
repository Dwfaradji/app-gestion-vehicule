import React from 'react';
import {useRouter} from "next/navigation";
const BoutonRetour = () => {
    const router = useRouter();

    return (
        <div>
            <button
                onClick={() => router.push("/vehicules")}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            >
                ← Retour
            </button>
        </div>
    );
};

export default BoutonRetour;