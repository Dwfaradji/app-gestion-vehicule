"use client";

import React, { useState, forwardRef } from "react";
import { CheckCircle, AlertCircle, Calendar, Eye, EyeOff, Clock } from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

export type FieldType = "text" | "number" | "select" | "date" | "time" | "password";
export type SelectOption = string | number | { label: string; value: string | number };

export interface FormFieldProps {
    label: string;
    type?: FieldType;
    value: any;
    onChange: (value: any) => void;
    options?: SelectOption[];
    disabled?: boolean;
    pattern?: string;
    error?: string;
    valid?: boolean;
    placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 label,
                                                 type = "text",
                                                 value,
                                                 onChange,
                                                 options,
                                                 disabled,
                                                 pattern,
                                                 error,
                                                 valid,
                                                 placeholder = "",
                                             }) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const iconSize = 20;
    const borderColor = error
        ? "border-red-500"
        : valid
            ? "border-green-500"
            : "border-gray-300 dark:border-gray-600";

    const baseClasses = `
    w-full max-w-md rounded-xl px-4 py-2.5 border ${borderColor}
    shadow-sm dark:shadow-black/20 transition-all duration-200 ease-in-out 
    focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none 
    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
  `;

    const renderFloatingLabel = () => (
        <label
            className={`absolute left-4 transition-all duration-200 ease-in-out z-10 pointer-events-none ${
                focused || value
                    ? "-top-3 text-xs text-blue-600 dark:text-blue-400 font-semibold"
                    : "top-3.5 text-gray-500 dark:text-gray-400 text-sm"
            }`}
        >
            {label}
        </label>
    );

    const renderValidationIcon = () => {
        if (!error && !valid) return null;
        const iconClasses =
            "absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-opacity duration-200";
        if (valid && !error)
            return <CheckCircle size={iconSize} className={`${iconClasses} text-green-500`} />;
        if (error)
            return <AlertCircle size={iconSize} className={`${iconClasses} text-red-500`} />;
        return null;
    };

    /** ---- DATE ---- */
    const DateInput = forwardRef<HTMLInputElement, any>(
        ({ value, onClick, placeholder }, ref) => (
            <div className="relative w-full max-w-md">
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
        )
    );
    DateInput.displayName = "DateInput";

    /** ---- PASSWORD ---- */
    if (type === "password") {
        return (
            <div className="relative w-full max-w-md mt-6">
                {renderFloatingLabel()}
                <input
                    type={showPassword ? "text" : "password"}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`${baseClasses} pr-10`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {error && <p className="text-red-600 text-xs mt-1 animate-pulse">{error}</p>}
            </div>
        );
    }

    /** ---- TIME ---- */
    if (type === "time") {
        return (
            <div className="relative w-full max-w-md mt-6">
                {renderFloatingLabel()}
                <input
                    type="time"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={disabled}
                    className={`${baseClasses} pr-10`}
                />
                <Clock
                    size={iconSize}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-20"
                />
                {renderValidationIcon()}
                {error && <p className="text-red-600 text-xs mt-1 animate-pulse">{error}</p>}
            </div>
        );
    }

    /** ---- SELECT ---- */
    if (type === "select") {
        return (
            <div className="relative w-full max-w-md mt-6">
                {renderFloatingLabel()}
                <select
                    value={value ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        const isObjectOption = options?.[0] && typeof options[0] === "object";
                        const parsed = isObjectOption
                            ? val
                            : options && typeof options[0] === "number"
                                ? Number(val)
                                : val;
                        onChange(parsed);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={disabled}
                    className={`${baseClasses} pr-10`}
                >
                    <option value="" hidden />
                    {options?.map((opt) =>
                        typeof opt === "object" ? (
                            <option key={opt.value.toString()} value={opt.value}>
                                {opt.label}
                            </option>
                        ) : (
                            <option key={opt.toString()} value={opt.toString()}>
                                {opt}
                            </option>
                        )
                    )}
                </select>
                {renderValidationIcon()}
                {error && <p className="text-red-600 text-xs mt-1 animate-pulse">{error}</p>}
            </div>
        );
    }

    /** ---- DATE ---- */
    if (type === "date") {
        return (
            <div className="relative w-full max-w-md mt-6">
                {renderFloatingLabel()}
                <DatePicker
                    locale="fr"
                    selected={value ? new Date(value) : null}
                    onChange={(date) => onChange(date ? date.toISOString().split("T")[0] : "")}
                    customInput={<DateInput />}
                    calendarClassName="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg p-2 w-full"
                    dateFormat="dd/MM/yyyy"
                />
                {renderValidationIcon()}
                {error && <p className="text-red-600 text-xs mt-1 animate-pulse">{error}</p>}
            </div>
        );
    }

    /** ---- NUMBER ---- */
    if (type === "number") {
        return (
            <div className="relative w-full max-w-md mt-6">
                {renderFloatingLabel()}
                <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={value ?? ""}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        onChange(Number.isNaN(val) ? 0 : val);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={disabled}
                    className={`${baseClasses}`}
                />
                {renderValidationIcon()}
                {error && <p className="text-red-600 text-xs mt-1 animate-pulse">{error}</p>}
            </div>
        );
    }

    /** ---- TEXT ---- */
    return (
        <div className="relative w-full max-w-md mt-6">
            {renderFloatingLabel()}
            <input
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={disabled}
                pattern={pattern}
                placeholder={placeholder}
                className={`${baseClasses}`}
            />
            {renderValidationIcon()}
            {error && <p className="text-red-600 text-xs mt-1 animate-pulse">{error}</p>}
        </div>
    );
};

export default FormField;