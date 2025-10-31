import React from "react";
import { Mail, Phone, MapPin, Globe, Hash, Building2, Plus } from "lucide-react";

interface DynamicFormProps {
  data: any;
  setData: (d: any) => void;
  fields: string[];
  fieldLabels?: Record<string, string>;
  fieldIcons?: Record<string, React.ReactNode>;
  fieldTypes?: Record<string, string>;
  onSubmit?: () => void;
  submitLabel?: string;
  readOnly?: boolean;
  inline?: boolean;
  columns?: number;
  className?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  data = {},
  setData,
  fields,
  fieldLabels = {},
  fieldIcons = {},
  fieldTypes = {},
  onSubmit,
  submitLabel,
  readOnly = false,
  inline = false,
  columns = 1,
  className = "",
}) => {
  return (
    <form
      className={`${inline ? "flex flex-wrap gap-2 items-end mb-5 " : `grid grid-cols-${columns} gap-4`} ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) {
          onSubmit();
        }
      }}
    >
      {fields.map((f) => (
        <div key={f} className="flex flex-col">
          {!readOnly && (
            <label className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              {fieldIcons[f]} {fieldLabels[f] || f}
            </label>
          )}
          <input
            type={fieldTypes[f] || "text"}
            placeholder={fieldLabels[f] || f}
            value={data[f] ?? ""}
            onChange={(e) => setData({ ...data, [f]: e.target.value })}
            className={`border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:border-blue-400 ${
              readOnly ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            readOnly={readOnly}
          />
        </div>
      ))}
      {submitLabel && !readOnly && (
        <button
          type="submit"
          className="text-green-500 flex items-center gap-1 font-medium px-3 py-1 border border-green-500 rounded-md hover:bg-green-50 transition"
        >
          <Plus size={20} />
          {submitLabel || ""}
        </button>
      )}
    </form>
  );
};

export const defaultFieldIcons: Record<string, React.ReactNode> = {
  email: <Mail size={14} />,
  telephone: <Phone size={14} />,
  adresse: <MapPin size={14} />,
  ville: <MapPin size={14} />,
  codePostal: <Hash size={14} />,
  pays: <Globe size={14} />,
  nom: <Building2 size={14} />,
};
