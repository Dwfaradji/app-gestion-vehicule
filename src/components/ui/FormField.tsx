"use client";
import React from "react";


// 🔹 Composant générique FormField
interface FormFieldProps {
    label: string;
    type?: "text" | "number" | "date" | "select";
    value: any;
    onChange: (value: any) => void;
    options?: string[] | number[];
    disabled?: boolean;
    pattern?: string;
}

const FormField = ({ label, type = "text", value, onChange, options, disabled, pattern }: FormFieldProps) => {
    return (
        <div className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1">{label}</label>
            {type === "select" ? (
                <select
                    value={value || ""}
                    onChange={e => onChange(options?.[0] && typeof options[0] === "number" ? Number(e.target.value) : e.target.value)}
                    disabled={disabled}
                    className="rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Sélectionner</option>
                    {options?.map(opt => (
                        <option key={opt.toString()} value={opt.toString()}>{opt}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={value || ""}
                    onChange={e => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
                    disabled={disabled}
                    pattern={pattern}
                    className="w-full rounded-lg px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                />
            )}
        </div>
    );
};
export default FormField;