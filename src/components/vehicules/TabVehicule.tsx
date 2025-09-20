"use client";

import { useState } from "react";
import { Vehicule } from "@/types/vehicule";
import { Plus } from "lucide-react";
import { ConfirmAction } from "@/types/actions";
import VehiculeRow from "@/components/vehicules/VehiculeRow";
import FormField from "@/components/ui/FormField";
import {
    constructeurs,
    types,
    energies,
    statuts,
    nombrePlaces,
    motorisations,
    chevauxFiscaux,
} from "@/data/vehiculeData";

interface Props {
    vehicules: Vehicule[];
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>;
}

export default function TabVehicules({ vehicules, setConfirmAction }: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formVehicule, setFormVehicule] = useState<Partial<Vehicule>>({});
    const [showFormVehicule, setShowFormVehicule] = useState(false);

    const selectedConstructeur = formVehicule.constructeur || "";

    const handleChange = <K extends keyof Vehicule>(field: K, value: any) => {
        let val: Vehicule[K] = value as Vehicule[K];

        // Gestion des nombres positifs
        if (typeof formVehicule[field] === "number") {
            val = Number(value) >= 0 ? Number(value) : 0 as Vehicule[K];
        }

        // Format automatique immatriculation AA-123-BB
        if (field === "immat" && value) {
            val = (value as string)
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .replace(/^([A-Z]{0,2})([0-9]{0,3})([A-Z]{0,2}).*$/, "$1-$2-$3") as any;
        }

        // Format et contrôle VIN (VIM)
        if (field === "vim" && value) {
            val = (value as string)
                .toUpperCase()
                .replace(/[^A-HJ-NPR-Z0-9]/g, "") // interdit I, O, Q
                .slice(0, 17) as any; // max 17 caractères
        }

        setFormVehicule(prev => ({ ...prev, [field]: val }));

        if (field === "constructeur") setFormVehicule(prev => ({ ...prev, modele: "" }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validateForm = () => {
        const requiredFields: (keyof Vehicule)[] = [
            "type",
            "constructeur",
            "modele",
            "km",
            "annee",
            "energie",
            "prixAchat",
            "dateEntretien",
            "statut",
            "prochaineRevision",
            "immat",
            "ctValidite",
            "vim",
            "places",
            "motorisation",
            "chevauxFiscaux",
        ];

        const newErrors: Record<string, string> = {};

        requiredFields.forEach(f => {
            if (!formVehicule[f]) newErrors[f] = `Le champ ${f} est requis`;
        });

        // Contrôle immatriculation
        if (formVehicule.immat) {
            const pattern = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/;
            if (!pattern.test(formVehicule.immat)) {
                newErrors.immat = "Immatriculation invalide (format AA-123-BB)";
            }
        }

        // Contrôle VIN
        if (formVehicule.vim) {
            const vin = formVehicule.vim as string;
            if (vin.length !== 17) {
                newErrors.vim = "Le VIN doit contenir exactement 17 caractères alphanumériques (sans I, O, Q)";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleValidate =async () => {
        if (!validateForm()) return;
        setConfirmAction({ type: "valider-vehicule", target: formVehicule });
        setShowFormVehicule(false);
    };
// Calcul du valid pour chaque champ
    const isFieldValid = (key: keyof Vehicule, value: any) => {
        if (!value) return false;

        switch (key) {
            case "immat":
                return /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(value);
            case "vim":
                return /^[A-HJ-NPR-Z0-9]{17}$/.test(value);
            default:
                return true; // tous les autres champs remplis sont considérés valides
        }
    };
    const fields = [
        { label: "Type", type: "select", value: formVehicule.type, options: types, key: "type" },
        {
            label: "Constructeur",
            type: "select",
            value: formVehicule.constructeur,
            options: Object.keys(constructeurs),
            key: "constructeur",
        },
        {
            label: "Modèle",
            type: "select",
            value: formVehicule.modele,
            options: selectedConstructeur ? constructeurs[selectedConstructeur as keyof typeof constructeurs] : [],
            key: "modele",
            disabled: !selectedConstructeur,
        },
        { label: "Kilométrage", type: "number", value: formVehicule.km, key: "km" },

        //TODO
        //Changer le text ( année ) par (date de mise en circulation) dans la base de donnée et partout dans le code
        { label: "Année", type: "number", value: formVehicule.annee, key: "annee" },
        { label: "Énergie", type: "select", value: formVehicule.energie, options: energies, key: "energie" },
        { label: "Prix d'achat (€)", type: "number", value: formVehicule.prixAchat, key: "prixAchat" },
        { label: "Date entretien", type: "date", value: formVehicule.dateEntretien, key: "dateEntretien" },
        { label: "Statut", type: "select", value: formVehicule.statut, options: statuts, key: "statut" },
        { label: "Prochaine révision", type: "date", value: formVehicule.prochaineRevision, key: "prochaineRevision" },
        {
            label: "Immatriculation (AA-123-BB)",
            type: "text",
            value: formVehicule.immat,
            key: "immat",
            pattern: "[A-Z]{2}-[0-9]{3}-[A-Z]{2}",
        },
        { label: "CT validité", type: "date", value: formVehicule.ctValidite, key: "ctValidite" },
        //TODO
        //Changer le type du vim en text dans le modèle prisma actuellement number
        { label: "VIM (VIN)", type: "text", value: formVehicule.vim, key: "vim" },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {/* Champs sauf les dates */}
                    {fields
                        .filter(f => f.type !== "date")
                        .map(f => (
                            <FormField
                                key={f.key}
                                label={f.label}
                                type={f.type as "select" | "text" | "number"}
                                value={f.value}
                                options={f.options}
                                onChange={v => handleChange(f.key as keyof Vehicule, v)}
                                disabled={f.disabled}
                                pattern={f.pattern}
                                error={errors[f.key]}
                                valid={isFieldValid(f.key as keyof Vehicule, f.value)}
                            />
                        ))}

                    {/* Champs date en 3 colonnes */}
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {fields
                            .filter(f => f.type === "date")
                            .map(f => (
                                <FormField
                                    key={f.key}
                                    label={f.label}
                                    type="date"
                                    value={f.value}
                                    onChange={v => handleChange(f.key as keyof Vehicule, v)}
                                    error={errors[f.key]}
                                    valid={isFieldValid(f.key as keyof Vehicule, f.value)}
                                />
                            ))}
                    </div>

                    {/* Bouton centré */}
                    <div className="col-span-2 flex justify-center mt-4">
                        <button
                            onClick={handleValidate}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition"
                        >
                            Valider
                        </button>
                    </div>
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
                    <VehiculeRow key={v.id} vehicule={v} setConfirmAction={setConfirmAction} />
                ))}
                </tbody>
            </table>
        </div>
    );
}