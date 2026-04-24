"use client";
import { useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function readTheme(): Theme {
  const stored = localStorage.getItem("theme");
  return stored === "light" ? "light" : "dark";
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();

  window.addEventListener("storage", handler);
  window.addEventListener("theme-change", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("theme-change", handler);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    window.dispatchEvent(new Event("theme-change"));
  }

  return (
    <button onClick={toggle} className="text-lg" title="Toggle theme">
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
