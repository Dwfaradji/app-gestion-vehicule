"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export type Field = {
  name: string;
  type: "text" | "email" | "password" | "select";
  placeholder?: string;
  options?: string[];
  icon?: React.ReactNode;
};

type BackLink = { text: string; href: string };

type AuthFormProps = {
  title: string;
  fields: Field[];
  submitText: string;
  onSubmitAction: (values: Record<string, string>) => Promise<void>;
  successMessage?: string;
  backLink?: BackLink | BackLink[];
  errorMessage?: string; // <-- erreur venant du parent
};

export default function AuthForm({
  title,
  fields,
  submitText,
  onSubmitAction,
  successMessage,
  backLink,
  errorMessage, // <-- reçu du parent
}: AuthFormProps) {
  const router = useRouter();
  const initialState = fields.reduce(
    (acc, f) => {
      acc[f.name] =
        f.type === "select"
          ? (f.options?.[0] ?? "") // première option ou ""
          : "";
      return acc;
    },
    {} as Record<string, string>,
  );
  const [values, setValues] = useState<Record<string, string>>(initialState);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));
  const handleTogglePassword = (name: string) =>
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmitAction(values);
    } finally {
      setLoading(false);
    }
  };

  const renderBackLinks = () => {
    if (!backLink) return null;
    const links = Array.isArray(backLink) ? backLink : [backLink];
    return (
      <div
        className={`mt-4 flex w-full ${links.length > 1 ? "justify-between" : "justify-center"} gap-2`}
      >
        {links.map((link, idx) => (
          <Button
            key={idx}
            type="button"
            onClick={() => router.push(link.href)}
            className="text-sm underline text-blue-700 hover:text-blue-900 p-0"
          >
            {link.text}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 to-blue-700">
      <Image
        src="/backgroundCars.jpg"
        width={1920}
        height={1080}
        priority
        alt="Illustration"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">{title}</h1>

        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center mb-4">
            {errorMessage}
          </p>
        )}

        {successMessage ? (
          <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg text-center flex flex-col items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg font-semibold">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="relative">
                {field.icon && <div className="absolute left-3 top-3">{field.icon}</div>}
                {field.type === "select" ? (
                  <select
                    value={values[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition bg-white"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type={
                        field.type === "password"
                          ? showPassword[field.name]
                            ? "text"
                            : "password"
                          : field.type
                      }
                      placeholder={field.placeholder}
                      value={values[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition"
                      required
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => handleTogglePassword(field.name)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword[field.name] ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full"
              loading={loading}
            >
              {loading ? "En cours…" : submitText}
            </Button>
          </form>
        )}

        {renderBackLinks()}
      </motion.div>
    </div>
  );
}
