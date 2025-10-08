"use client";

import { useState } from "react";
import { Vehicule } from "@/types/vehicule";
import { Plus } from "lucide-react";
import { ConfirmAction } from "@/types/actions";
import FormField from "@/components/ui/FormField";
import Table from "@/components/ui/Table";
import ActionButtons from "@/components/ui/ActionButtons";
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
    const [formVehicule, setFormVehicule] = useState<Partial<Vehicule>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showFormVehicule, setShowFormVehicule] = useState(false);

    const handleChange = <K extends keyof Vehicule>(field: K, value: any) => {
        let val: Vehicule[K] = value as Vehicule[K];

        // Gestion des nombres
        if (typeof formVehicule[field] === "number") {
            val = Number(value) >= 0 ? Number(value) : (0 as Vehicule[K]);
        }

        // Gestion immatriculation
        if (field === "immat" && value) {
            val = (value as string)
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .replace(/^([A-Z]{0,2})([0-9]{0,3})([A-Z]{0,2}).*$/, "$1-$2-$3") as any;
        }

        // Gestion VIN
        if (field === "vim" && value) {
            val = (value as string).toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17) as any;
        }

        setFormVehicule(prev => ({ ...prev, [field]: val }));

        // Reset modèle si constructeur changé
        if (field === "constructeur") setFormVehicule(prev => ({ ...prev, modele: "" }));

        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validateForm = () => {
        const requiredFields: (keyof Vehicule)[] = [
            "type","constructeur","modele","km","annee","energie","prixAchat",
            "dateEntretien","statut","prochaineRevision","immat","ctValidite",
            "vim","places","motorisation","chevauxFiscaux"
        ];

        const newErrors: Record<string,string> = {};

        requiredFields.forEach(f => {
            if (!formVehicule[f] && formVehicule[f] !== 0) newErrors[f] = `Le champ ${f} est requis`;
        });

        if (formVehicule.immat && !/^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(formVehicule.immat)) {
            newErrors.immat = "Immatriculation invalide (AA-123-BB)";
        }

        if (formVehicule.vim && (formVehicule.vim as string).length !== 17) {
            newErrors.vim = "Le VIN doit contenir 17 caractères (sans I,O,Q)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleValidate = () => {
        if (!validateForm()) return;
        setConfirmAction({ type: "valider-vehicule", target: formVehicule });
        setShowFormVehicule(false);
    };

    const isFieldValid = (key: keyof Vehicule, value: any) => {
        if (!value) return false;
        if (key === "immat") return /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(value);
        if (key === "vim") return /^[A-HJ-NPR-Z0-9]{17}$/.test(value);
        return true;
    };

    const selectedConstructeur = formVehicule.constructeur || "";

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
        { label: "Immatriculation (AA-123-BB)", type: "text", value: formVehicule.immat, key: "immat", pattern: "[A-Z]{2}-[0-9]{3}-[A-Z]{2}" },
        { label: "CT validité", type: "date", value: formVehicule.ctValidite, key: "ctValidite" },
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
                    {fields.filter(f => f.type !== "date").map(f => (
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

                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {fields.filter(f => f.type === "date").map(f => (
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

            <Table
                data={vehicules}
                columns={[
                    { key: "type", label: "Type" },
                    { key: "constructeur", label: "Constructeur" },
                    { key: "modele", label: "Modèle" },
                    { key: "km", label: "Km", render: v => `${v.km?.toLocaleString() ?? 0} km` },
                    { key: "immat", label: "Immat" },
                    {
                        key: "actions",
                        label: "Actions",
                        render: v => (
                            <ActionButtons
                                row={v}
                                buttons={[
                                    {
                                        icon: "Trash2",
                                        color: "red",
                                        tooltip: "Supprimer",
                                        onClick: r => setConfirmAction({ type: "supprimer-vehicule", target: r }),
                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
}