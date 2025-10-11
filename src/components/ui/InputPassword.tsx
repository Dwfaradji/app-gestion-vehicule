import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

export const InputPassword = React.memo(
  ({
    label,
    value,
    onChange,
    id,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    id: string;
  }) => {
    const [show, setShow] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const toggleShow = () => {
      setShow((s) => !s);
      // Restaurer le focus et la position du curseur pour éviter le saut
      if (inputRef.current) {
        const pos = inputRef.current.selectionStart || 0;
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(pos, pos);
        }, 0);
      }
    };

    return (
      <div className="space-y-1 relative">
        <label className="text-sm font-medium text-gray-700" htmlFor={id}>
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={inputRef}
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            className="w-full rounded-xl px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={toggleShow}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100"
            tabIndex={-1}
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {show ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
    );
  },
);

// Ajout du displayName pour ESLint
InputPassword.displayName = "InputPassword";
