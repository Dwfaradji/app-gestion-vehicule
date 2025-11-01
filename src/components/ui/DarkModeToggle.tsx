"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const DarkModeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null; // ✅ évite les erreurs de SSR

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2  p-1 rounded-xl font-semibold transition bg-transparent dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md hover:shadow-lg"
    >
      {currentTheme === "dark" ? (
        <>
          <Sun className="w-5 h-5 text-yellow-400" />
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-blue-600" />
        </>
      )}
    </button>
  );
};
