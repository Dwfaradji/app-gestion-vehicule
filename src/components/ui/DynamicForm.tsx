import React from "react";
import { Mail, Phone, MapPin, Globe, Hash, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Generic, index-signature-free model support
interface DynamicFormProps<T extends object = Record<string, unknown>> {
  data: T;
  // Accepts either a full value or an updater function (compatible with React setState)
  setData: (d: T | ((prev: T) => T)) => void;
  // List of field names to render
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

export function DynamicForm<T extends object = Record<string, unknown>>({
  data,
  setData,
  fields,
  fieldLabels,
  fieldIcons,
  fieldTypes,
  onSubmit,
  submitLabel,
  readOnly = false,
  inline = false,
  columns = 1,
  className,
}: DynamicFormProps<T>) {
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
      {fields.map((f) => {
        const value = (data as Record<string, unknown>)[f];
        return (
          <div key={f} className="flex flex-col">
            {!readOnly && (
              <label className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                {fieldIcons?.[f]} {fieldLabels?.[f] ?? f}
              </label>
            )}
            <input
              type={fieldTypes?.[f] ?? "text"}
              placeholder={fieldLabels?.[f] ?? f}
              value={value == null ? "" : String(value)}
              onChange={(e) =>
                setData(
                  (prev) =>
                    ({ ...(prev as unknown as Record<string, unknown>), [f]: e.target.value }) as T,
                )
              }
              className={`border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:border-blue-400 ${
                readOnly ? "border-none cursor-not-allowed " : ""
              }`}
              readOnly={readOnly}
            />
          </div>
        );
      })}
      {submitLabel && !readOnly && (
        <Button type="submit" variant="success" leftIcon={<Plus size={20} />}>
          {submitLabel || ""}
        </Button>
      )}
    </form>
  );
}

export const defaultFieldIcons: Record<string, React.ReactNode> = {
  email: <Mail size={14} />,
  telephone: <Phone size={14} />,
  adresse: <MapPin size={14} />,
  ville: <MapPin size={14} />,
  codePostal: <Hash size={14} />,
  pays: <Globe size={14} />,
  nom: <Building2 size={14} />,
};
