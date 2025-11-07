"use client";
import { Moon, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";


export default function ThemeToggle() {
 const { theme, toggle } = useTheme();


  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full bg-[var(--color-primary)] text-[var(--color-bg)] shadow-md hover:opacity-90 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
