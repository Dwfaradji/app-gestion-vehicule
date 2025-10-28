import { useState, useEffect } from "react";
import { Entreprise } from "@/types/entreprise";
import { Edit3, Save, X } from "lucide-react";

type EntrepriseForm = {
    nom: string;
    siret: string;
    ville: string;
    pays: string;
    adresse: string;
    codePostal: string;
    email: string;
    telephone: string;
};

interface EntrepriseInfoProps {
    entreprise: Entreprise | null;
    updateEntreprise?: (id: number, data: Partial<Entreprise>) => Promise<void>;
}

export default function EntrepriseInfo({ entreprise, updateEntreprise }: EntrepriseInfoProps) {
    const [formValues, setFormValues] = useState<EntrepriseForm>({
        nom: "",
        siret: "",
        ville: "",
        pays: "",
        adresse: "",
        codePostal: "",
        email: "",
        telephone: "",
    });

    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (entreprise) {
            setFormValues({
                nom: entreprise.nom ?? "",
                siret: entreprise.siret ?? "",
                ville: entreprise.ville ?? "",
                pays: entreprise.pays ?? "",
                adresse: entreprise.adresse ?? "",
                codePostal: entreprise.codePostal ?? "",
                email: entreprise.email ?? "",
                telephone: entreprise.telephone ?? "",
            });
        }
    }, [entreprise]);

    const handleChange = (key: keyof EntrepriseForm, value: string) => {
        setFormValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!entreprise || !updateEntreprise) return;
        await updateEntreprise(entreprise.id, formValues);
        setEditing(false);
    };

    const handleCancel = () => {
        if (!entreprise) return;
        setFormValues({
            nom: entreprise.nom ?? "",
            siret: entreprise.siret ?? "",
            ville: entreprise.ville ?? "",
            pays: entreprise.pays ?? "",
            adresse: entreprise.adresse ?? "",
            codePostal: entreprise.codePostal ?? "",
            email: entreprise.email ?? "",
            telephone: entreprise.telephone ?? "",
        });
        setEditing(false);
    };

    const labels: Record<keyof EntrepriseForm, string> = {
        nom: "Nom de l’entreprise",
        siret: "SIRET",
        ville: "Ville",
        pays: "Pays",
        adresse: "Adresse",
        codePostal: "Code postal",
        email: "Email",
        telephone: "Téléphone",
    };

    return (
        <div className="p-6 mb-6  mx-auto bg-white border border-gray-200 rounded-2xl shadow-md">
            <div className="grid grid-cols-2 gap-6">
                {Object.entries(formValues).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">{labels[key as keyof EntrepriseForm]}</label>
                        {editing ? (
                            <input
                                type={key === "email" ? "email" : key === "telephone" ? "tel" : "text"}
                                value={value as string}
                                onChange={(e) => handleChange(key as keyof EntrepriseForm, e.target.value)}
                                className="w-full border-b border-gray-300 focus:border-blue-400 outline-none px-1 py-1 rounded-sm"
                            />
                        ) : (
                            <p className="text-gray-700">{value || "-"}</p>
                        )}
                    </div>
                ))}
            </div>

            {updateEntreprise && (
                <div className="mt-6 flex gap-3 justify-end">
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            <Edit3 size={18} />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                            >
                                <Save size={18} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                <X size={18} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}