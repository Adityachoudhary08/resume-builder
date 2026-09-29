"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("resume-builder-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const shouldUseLight = savedTheme === "light" || (!savedTheme && prefersLight);

    setIsLight(shouldUseLight);
    document.documentElement.dataset.theme = shouldUseLight ? "light" : "dark";
  }, []);

  const toggleTheme = () => {
    const nextIsLight = !isLight;

    setIsLight(nextIsLight);
    document.documentElement.dataset.theme = nextIsLight ? "light" : "dark";
    window.localStorage.setItem(
      "resume-builder-theme",
      nextIsLight ? "light" : "dark"
    );
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
