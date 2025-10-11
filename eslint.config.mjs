// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // 🔹 Charge les règles de base de Next.js et TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 🔹 Ton bloc de config personnalisée
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "build/**",
      "dist/**",
      "out/**",
      "src/generated/prisma/**", // on ignore le code généré par Prisma
    ],

    rules: {
      // Style de code
      semi: ["error", "always"],
      quotes: ["error", "double"],

      // 🚫 Interdit console.log (mais autorise warn et error)
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;
