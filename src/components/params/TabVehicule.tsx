"use client";
import { Vehicule } from "@/types/vehicule";
import { Trash, Plus } from "lucide-react";
import { useState } from "react";

interface Props {
    vehicules: Vehicule[];
    formVehicule: Partial<Vehicule>;
    setFormVehicule: React.Dispatch<React.SetStateAction<Partial<Vehicule>>>;
    showForm: boolean;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmAction: (action: { type: string; target: any }) => void;
}

// Constructeurs et modèles
const constructeurs = {
    Renault: ["Kangoo", "Clio", "Megane", "Captur"],
    Peugeot: ["308", "3008", "508"],
    Citroën: ["Berlingo", "C4", "C3 Aircross"],
    Tesla: ["Model S", "Model 3", "Model Y"],
    BMW: ["Serie 1", "Serie 3", "X5"],
    Audi: ["A3", "A4", "Q5"],
    Mercedes: ["Classe A", "Classe C", "GLC"],
    Volkswagen: ["Golf", "Passat", "Tiguan"],
};

const types = ["Berline", "SUV", "Utilitaire", "Citadine"];
const energies = ["Essence", "Diesel", "Électrique", "Hybride"];
const statuts = ["Disponible", "Incident", "Maintenance"];
const nombrePlaces = [2, 4, 5, 7, 8, 9];
const motorisations = ["1.0", "1.2", "1.4", "1.6", "2.0", "2.5", "3.0", "Électrique"];
const chevauxFiscaux = [4, 5, 6, 7, 8, 9, 10, 12];

export default function TabVehicules({
                                         vehicules,
                                         formVehicule,
                                         setFormVehicule,
                                         showForm,
                                         setShowForm,
                                         setConfirmAction,
                                     }: Props) {
    const [errors, setErrors] = useState<string[]>([]);

    const handleValidate = () => {
        const requiredFields = [
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
        const missing = requiredFields.filter(f => !formVehicule[f as keyof Vehicule]);
        if (missing.length > 0) {
            setErrors(missing);
            return;
        }
        setErrors([]);
        console.log(formVehicule);
        setConfirmAction({ type: "valider-vehicule", target: formVehicule });
        setShowForm(false);
    };

    const handleChange = (field: keyof Vehicule, value: string | number) => {
        setFormVehicule(prev => ({ ...prev, [field]: value }));

        // Si on change le constructeur, reset le modèle
        if (field === "constructeur") setFormVehicule(prev => ({ ...prev, modele: "" }));
    };

    const selectedConstructeur = formVehicule.constructeur || "";

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Liste des véhicules</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 mb-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
                <Plus className="w-4 h-4" /> Ajouter un véhicule
            </button>

            {showForm && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
                    {errors.length > 0 && (
                        <div className="text-red-600 text-sm">Champs manquants : {errors.join(", ")}</div>
                    )}

                    {/* Type */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Type</label>
                        <select
                            value={formVehicule.type || ""}
                            onChange={e => handleChange("type", e.target.value)}
                            className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Sélectionner le type</option>
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Constructeur */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Constructeur</label>
                        <select
                            value={formVehicule.constructeur || ""}
                            onChange={e => handleChange("constructeur", e.target.value)}
                            className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Sélectionner le constructeur</option>
                            {Object.keys(constructeurs).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Modèle */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Modèle</label>
                        <select
                            value={formVehicule.modele || ""}
                            onChange={e => handleChange("modele", e.target.value)}
                            disabled={!selectedConstructeur}
                            className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Sélectionner le modèle</option>
                            {selectedConstructeur && constructeurs[selectedConstructeur as keyof typeof constructeurs].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    {/* KM */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Kilométrage</label>
                        <input type="number" value={formVehicule.km || ""} onChange={e => handleChange("km", Number(e.target.value))} className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Année */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Année</label>
                        <input type="number" value={formVehicule.annee || ""} onChange={e => handleChange("annee", Number(e.target.value))} className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Énergie */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Énergie</label>
                        <select value={formVehicule.energie || ""} onChange={e => handleChange("energie", e.target.value)} className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner l'énergie</option>
                            {energies.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    {/* Prix d'achat */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Prix d'achat (€)</label>
                        <input type="number" value={formVehicule.prixAchat || ""} onChange={e => handleChange("prixAchat", Number(e.target.value))} className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Date entretien */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Date d'entretien</label>
                        <input type="date" value={formVehicule.dateEntretien || ""} onChange={e => handleChange("dateEntretien", e.target.value)} className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Statut */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Statut</label>
                        <select value={formVehicule.statut || ""} onChange={e => handleChange("statut", e.target.value)} className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner le statut</option>
                            {statuts.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Prochaine révision */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Prochaine révision</label>
                        <input type="date" value={formVehicule.prochaineRevision || ""} onChange={e => handleChange("prochaineRevision", e.target.value)} className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Immatriculation */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Immatriculation (AA-123-BB)</label>
                        <input type="text" value={formVehicule.immat || ""} onChange={e => handleChange("immat", e.target.value)} pattern="[A-Z]{2}-[0-9]{3}-[A-Z]{2}" className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* CT validité */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">CT validité</label>
                        <input type="date" value={formVehicule.ctValidite || ""} onChange={e => handleChange("ctValidite", e.target.value)} className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* VIM */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">VIM</label>
                        <input type="number" value={formVehicule.vim || ""} onChange={e => handleChange("vim", Number(e.target.value))} className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Nombre de places */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Nombre de places</label>
                        <select value={formVehicule.places || ""} onChange={e => handleChange("places", Number(e.target.value))} className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner le nombre de places</option>
                            {nombrePlaces.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    {/* Motorisation */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Motorisation</label>
                        <select value={formVehicule.motorisation || ""} onChange={e => handleChange("motorisation", e.target.value)} className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner la motorisation</option>
                            {motorisations.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    {/* Chevaux fiscaux */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 text-sm mb-1">Chevaux fiscaux</label>
                        <select value={formVehicule.chevauxFiscaux || ""} onChange={e => handleChange("chevauxFiscaux", Number(e.target.value))} className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner les CV</option>
                            {chevauxFiscaux.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <button onClick={handleValidate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Valider
                    </button>
                </div>
            )}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {["Type", "Constructeur", "Modèle", "Km", "Immat", "Actions"].map(t => (
                        <th key={t} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {vehicules.map(v => (
                    <tr key={v.id}>
                        <td className="px-4 py-2 text-sm text-gray-700">{v.type}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{v.constructeur}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{v.modele}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{v.km?.toLocaleString()} km</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{v.immat}</td>
                        <td className="px-4 py-2 text-sm flex gap-2">
                            <button
                                onClick={() => setConfirmAction({ type: "supprimer-vehicule", target: v })}
                                className="text-red-600 flex items-center gap-1 hover:underline"
                            >
                                <Trash className="w-3 h-3" /> Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}