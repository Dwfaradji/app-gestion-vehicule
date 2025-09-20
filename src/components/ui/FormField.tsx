"use client";

import React, { useState, forwardRef } from "react";
import { CheckCircle, AlertCircle, Calendar } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import {fr} from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

interface FormFieldProps {
    label: string;
    type?: "text" | "number" | "select" | "date";
    value: any;
    onChange: (value: any) => void;
    options?: string[] | number[];
    disabled?: boolean;
    pattern?: string;
    error?: string;
    valid?: boolean;
}

const FormField = ({
                       label,
                       type = "text",
                       value,
                       onChange,
                       options,
                       disabled,
                       pattern,
                       error,
                       valid,
                   }: FormFieldProps) => {
    const [focused, setFocused] = useState(false);

    const iconSize = 20;
    const borderColor = error
        ? "border-red-500"
        : valid
            ? "border-green-500"
            : "border-gray-300 dark:border-gray-600";

    const baseClasses =
        `w-full rounded-xl px-4 p-3 border ${borderColor}
   shadow-sm dark:shadow-black/20 transition-all duration-200 ease-in-out 
   focus:outline-none focus:ring-0 appearance-none`; // <-- ici on enlève le bleu
    const renderFloatingLabel = () => (
        <label
            className={`absolute left-4 pointer-events-none transition-all duration-200 ease-in-out z-10 ${
                focused || value ? "-top-4 text-xs text-blue-600 dark:text-blue-400 font-semibold" : "top-4 text-gray-500 dark:text-gray-400 text-sm"
            }`}
        >
            {label}
        </label>
    );

    const renderIcon = () => {
        const hasError = Boolean(error);
        const isValid = Boolean(valid);

        if (!hasError && !isValid) return null;

        const iconClasses = `absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-opacity duration-200`;


        if (isValid && !hasError) return <CheckCircle size={iconSize} className={`${iconClasses} text-green-500`} />;
        if (hasError) return <AlertCircle size={iconSize} className={`${iconClasses} text-red-500`} />;
        return null;
    };

    // Custom input pour DatePicker avec icône à l'intérieur
    const DateInput = forwardRef<HTMLInputElement, any>(({ value, onClick, placeholder }, ref) => (
        <div className="relative w-full">
            <input
                ref={ref}
                value={value}
                onClick={onClick}
                placeholder={placeholder}
                readOnly
                className={`${baseClasses} pr-10`}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <Calendar
                size={iconSize}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-20"
            />
        </div>
    ));
    DateInput.displayName = "DateInput";

    // SELECT
    if (type === "select") {
        return (
            <div className="relative w-full mt-6">
                {renderFloatingLabel()}
                <select
                    value={value || ""}
                    onChange={(e) =>
                        onChange(options?.[0] && typeof options[0] === "number" ? Number(e.target.value) : e.target.value)
                    }
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={disabled}
                    className={`${baseClasses} pr-10 `}
                >
                    <option value="" hidden></option>
                    {options?.map((opt) => (
                        <option key={opt.toString()} value={opt.toString()}>
                            {opt}
                        </option>
                    ))}
                </select>
                {renderIcon()}
                {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1 animate-pulse">{error}</p>}
            </div>
        );
    }

    // DATE
    if (type === "date") {
        return (
            <div className="relative w-full mt-6">
                {renderFloatingLabel()}
                <DatePicker
                    locale="fr"
                    selected={value ? new Date(value) : null}
                    onChange={(date) => onChange(date?.toISOString().split("T")[0])}
                    placeholderText=""
                    customInput={<DateInput />}
                    calendarClassName="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg p-2 w-full"
                    dateFormat="dd/MM/yyyy"
                />
                {renderIcon()}
                {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1 animate-pulse">{error}</p>}
            </div>
        );
    }

    // NUMBER
    if (type === "number") {
        return (
            <div className="relative w-full mt-6">
                {renderFloatingLabel()}
                <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    pattern="[0-9]*"
                    value={value || ""}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        onChange(val >= 0 ? val : 0); // jamais négatif
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={disabled}
                    className={`${baseClasses}  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [moz-appearance:textfield]`}
                />
                {renderIcon()}
                {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1 animate-pulse">{error}</p>}
            </div>
        );
    }

    // TEXT
    return (
        <div className="relative w-full mt-6">
            {renderFloatingLabel()}
            <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={disabled}
                pattern={pattern}
                className={`${baseClasses} appearance-none`}
            />
            {renderIcon()}
            {error && <p className="text-red-600 dark:text-red-400 text-xs mt-1 animate-pulse">{error}</p>}
        </div>
    );
};

export default FormField;