"use client";

import React, { useState } from "react";
import { CheckCircle, AlertCircle, Calendar, Eye, EyeOff } from "lucide-react";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import DatePicker from "react-datepicker";
import { motion, AnimatePresence } from "framer-motion";

registerLocale("fr", fr);

export type FieldType = "text" | "number" | "select" | "date" | "time" | "password";
export type SelectOption<T = string | number> = T | { label: string; value: T };

export interface FormFieldProps<T = string | number | Date> {
  label: string;
  type?: FieldType;
  value: T | null | undefined;
  onChange: (value: T) => void;
  options?: SelectOption<T>[];
  disabled?: boolean;
  pattern?: string;
  error?: string;
  valid?: boolean;
  placeholder?: string;
}

interface DateInputProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
}

const FormField = <T extends string | number | Date>({
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
}: FormFieldProps<T>) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const iconSize = 20;

  const borderColor = error
    ? "border-red-500"
    : valid
      ? "border-green-500"
      : "border-gray-300 dark:border-gray-600";

  // IMPORTANT: add pr-10 to leave space for the validation icon (absolute right)
  const baseClasses = `
    w-full max-w-md rounded-xl px-4 py-2.5 border ${borderColor} pr-10
    shadow-sm dark:shadow-black/20 transition-all duration-200 ease-in-out 
    focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none 
    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
  `;

  const renderFloatingLabel = () => (
    <label
      className={`absolute left-4 transition-all duration-200 ease-in-out z-10 pointer-events-none ${
        focused || value
          ? " -top-5 text-xs text-blue-600 dark:text-blue-400 font-semibold"
          : "top-3.5 text-gray-500 dark:text-gray-400 text-sm"
      }`}
    >
      {label}
    </label>
  );

  const renderValidationIcon = () => {
    const iconClasses = "absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none";

    return (
      <AnimatePresence mode="wait">
        {valid && !error && (
          <motion.div
            key="valid"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={iconClasses}
          >
            <CheckCircle size={20} className="text-green-500 translate-y-[1px]" />
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={iconClasses}
          >
            <AlertCircle size={20} className="text-red-500 translate-y-[1px]" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  /** ---- DATE ---- */
  if (type === "date") {
    return (
      <div className="relative w-full max-w-md mt-6">
        {renderFloatingLabel()}

        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => onChange(date as T)}
          locale="fr"
          placeholderText={placeholder}
          className={baseClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
        />

        {/* ✅ Affiche le calendrier seulement si ce n’est pas valide */}
        {!valid && !error && (
          <Calendar
            size={iconSize}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-20"
          />
        )}

        {/* ✅ Si valide → check vert / Si erreur → rouge */}
        {renderValidationIcon()}

        {error && (
          <p
            className="absolute left-0 top-full mt-1 text-red-600 text-xs animate-pulse"
            style={{ lineHeight: "1rem" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  /** ---- PASSWORD ---- */
  if (type === "password") {
    return (
      <div className="relative w-full max-w-md mt-6">
        {renderFloatingLabel()}
        <input
          type={showPassword ? "text" : "password"}
          value={(value ?? "") as string}
          onChange={(e) => onChange(e.target.value as T)}
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
        {error && (
          <p
            className="absolute left-0 top-full mt-1 text-red-600 text-xs animate-pulse"
            style={{ lineHeight: "1rem" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  /** ---- SELECT ---- */
  if (type === "select") {
    type SelectT = Extract<T, string | number>; // ⚠️ interdit Date pour select
    return (
      <div className="relative w-full max-w-md mt-6">
        {renderFloatingLabel()}
        <select
          value={(value ?? "") as unknown as string | number}
          onChange={(e) => {
            const raw = e.target.value; // toujours string
            // Détecte si les options sont des nombres (vérifie le premier option non vide)
            const isNumericOption = options
              ? options.some((opt) => {
                  const v = typeof opt === "object" ? (opt.valueOf as unknown) : (opt as unknown);
                  return typeof v === "number";
                })
              : false;

            let val: unknown;
            if ((e.target as HTMLSelectElement).multiple) {
              const selected = Array.from((e.target as HTMLSelectElement).selectedOptions).map(
                (opt) => (isNumericOption ? Number(opt.value) : opt.value),
              );
              val = selected as unknown;
            } else {
              val = isNumericOption ? Number(raw) : raw;
            }

            onChange(val as T);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`${baseClasses} pr-10`}
        >
          <option value="" hidden />
          {options
            ?.filter(
              (opt): opt is SelectOption<SelectT> => typeof opt !== "object" || "value" in opt,
            )
            .map((opt) =>
              typeof opt === "object" ? (
                // React acceptera un value number mais DOM le rendra string : on reconvertit plus haut
                <option key={String(opt.value)} value={opt.value as unknown as string | number}>
                  {opt.label}
                </option>
              ) : (
                <option key={String(opt)} value={opt as unknown as string | number}>
                  {opt}
                </option>
              ),
            )}
        </select>
        {renderValidationIcon()}

        {error && (
          <p
            className="absolute left-0 top-full mt-1 text-red-600 text-xs animate-pulse"
            style={{ lineHeight: "1rem" }}
          >
            {error}
          </p>
        )}
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
          value={(value ?? "") as number}
          onChange={(e) => onChange(Number(e.target.value) as T)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`${baseClasses}`}
        />
        {renderValidationIcon()}
        {error && (
          <p
            className="absolute left-0 top-full mt-1 text-red-600 text-xs animate-pulse"
            style={{ lineHeight: "1rem" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  /** ---- TEXT ---- */
  return (
    <div className="relative w-full max-w-md mt-6">
      {renderFloatingLabel()}
      <input
        type="text"
        value={(value ?? "") as string}
        onChange={(e) => onChange(e.target.value as T)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        pattern={pattern}
        placeholder={placeholder}
        className={`${baseClasses}`}
      />
      {renderValidationIcon()}
      {error && (
        <p
          className="absolute left-0 top-full mt-1 text-red-600 text-xs animate-pulse"
          style={{ lineHeight: "1rem" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
