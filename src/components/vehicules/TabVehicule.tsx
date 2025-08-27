"use client";

import { useState } from "react";
import { Vehicule } from "@/types/vehicule";
import { Plus } from "lucide-react";
import { ConfirmAction } from "@/types/actions";
import VehiculeRow from "@/components/vehicules/VehiculeRow";
import FormField from "@/components/ui/FormField";
import { constructeurs, types, energies, statuts, nombrePlaces, motorisations, chevauxFiscaux } from "@/data/vehiculeData";

interface Props {
    vehicules: Vehicule[];
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabVehicules({
                                         vehicules,
                                         setConfirmAction,
                                     }: Props) {

    const [errors, setErrors] = useState<string[]>([]);
    const [formVehicule, setFormVehicule] = useState<Vehicule>({});
    const [showFormVehicule, setShowFormVehicule] = useState(false);


    const selectedConstructeur = formVehicule.constructeur || "";




    // ✅ HandleChange sans "any", typage automatique
    const handleChange = <K extends keyof Vehicule>(
        field: K,
        value: string
    ) => {
        let val: Vehicule[K] = value as Vehicule[K];

        // Conversion automatique si la valeur cible est un nombre
        if (typeof formVehicule[field] === "number") {
            val = Number(value) as Vehicule[K];
        }

        setFormVehicule(prev => ({ ...prev, [field]: val }));

        if (field === "constructeur") {
            setFormVehicule(prev => ({ ...prev, modele: "" }));
        }
    };

    const handleValidate = () => {
        const requiredFields: (keyof Vehicule)[] = [
            "type","constructeur","modele","km","annee","energie","prixAchat","dateEntretien",
            "statut","prochaineRevision","immat","ctValidite","vim","places","motorisation","chevauxFiscaux"
        ];
        const missing = requiredFields.filter(f => !formVehicule[f]);
        if (missing.length) {
            setErrors(missing.map(f => f.toString()));
            return;
        }
        setErrors([]);
        setConfirmAction({ type: "valider-vehicule", target: formVehicule });
        setShowFormVehicule(false);
    };

    // Champs pour le formulaire
    const fields = [
        { label: "Type", type: "select", value: formVehicule.type, options: types, key: "type" },
        { label: "Constructeur", type: "select", value: formVehicule.constructeur, options: Object.keys(constructeurs), key: "constructeur" },
        { label: "Modèle", type: "select", value: formVehicule.modele, options: selectedConstructeur ? constructeurs[selectedConstructeur as keyof typeof constructeurs] : [], key: "modele", disabled: !selectedConstructeur },
        { label: "Kilométrage", type: "number", value: formVehicule.km, key: "km" },
        { label: "Année", type: "number", value: formVehicule.annee, key: "annee" },
        { label: "Énergie", type: "select", value: formVehicule.energie, options: energies, key: "energie" },
        { label: "Prix d'achat (€)", type: "number", value: formVehicule.prixAchat, key: "prixAchat" },
        { label: "Date entretien", type: "date", value: formVehicule.dateEntretien, key: "dateEntretien" },
        { label: "Statut", type: "select", value: formVehicule.statut, options: statuts, key: "statut" },
        { label: "Prochaine révision", type: "date", value: formVehicule.prochaineRevision, key: "prochaineRevision" },
        { label: "Immatriculation (AA-123-BB)", value: formVehicule.immat, key: "immat", pattern: "[A-Z]{2}-[0-9]{3}-[A-Z]{2}" },
        { label: "CT validité", type: "date", value: formVehicule.ctValidite, key: "ctValidite" },
        { label: "VIM", type: "number", value: formVehicule.vim, key: "vim" },
        { label: "Nombre de places", type: "select", value: formVehicule.places, options: nombrePlaces, key: "places" },
        { label: "Motorisation", type: "select", value: formVehicule.motorisation, options: motorisations, key: "motorisation" },
        { label: "Chevaux fiscaux", type: "select", value: formVehicule.chevauxFiscaux, options: chevauxFiscaux, key: "chevauxFiscaux" },
    ];

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Liste des véhicules</h2>
            <button
                onClick={() => setShowFormVehicule(!showFormVehicule)}
                className="flex items-center gap-2 mb-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
                <Plus className="w-4 h-4" /> Ajouter un véhicule
            </button>

            {showFormVehicule && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
                    {errors.length > 0 && (
                        <div className="text-red-600 text-sm">
                            Champs manquants : {errors.join(", ")}
                        </div>
                    )}
                    {fields.map(f => (
                        <FormField
                            key={f.key}
                            label={f.label}
                            type={f.type as "select" | "date" | "number" | "text"}
                            value={f.value}
                            options={f.options}
                            onChange={v => handleChange(f.key as keyof Vehicule, v)}
                            disabled={f.disabled}
                            pattern={f.pattern}
                        />
                    ))}
                    <button
                        onClick={handleValidate}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Valider
                    </button>
                </div>
            )}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {["Type", "Constructeur", "Modèle", "Km", "Immat", "Actions"].map(t => (
                        <th
                            key={t}
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                            {t}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {vehicules.map(v => (
                    <VehiculeRow
                        key={v.id}
                        vehicule={v}
                        setConfirmAction={setConfirmAction}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}