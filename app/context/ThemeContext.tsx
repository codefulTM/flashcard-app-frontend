"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ThemeColor =
  | "indigo"
  | "rose"
  | "emerald"
  | "amber"
  | "cyan"
  | "violet";
export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  setThemeColor: (color: ThemeColor) => void;
  setThemeMode: (mode: ThemeMode) => void;
  actualMode: "light" | "dark"; // The actual resolved mode (system resolved to light/dark)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeColors = {
  indigo: {
    name: "Indigo",
    primary: {
      start: "#6366f1",
      mid: "#8b5cf6",
      end: "#d946ef",
    },
    icon: "💜",
  },
  rose: {
    name: "Rose",
    primary: {
      start: "#f43f5e",
      mid: "#ec4899",
      end: "#f97316",
    },
    icon: "🌹",
  },
  emerald: {
    name: "Emerald",
    primary: {
      start: "#10b981",
      mid: "#14b8a6",
      end: "#06b6d4",
    },
    icon: "💚",
  },
  amber: {
    name: "Amber",
    primary: {
      start: "#f59e0b",
      mid: "#f97316",
      end: "#ef4444",
    },
    icon: "🧡",
  },
  cyan: {
    name: "Cyan",
    primary: {
      start: "#06b6d4",
      mid: "#3b82f6",
      end: "#8b5cf6",
    },
    icon: "💙",
  },
  violet: {
    name: "Violet",
    primary: {
      start: "#8b5cf6",
      mid: "#a855f7",
      end: "#d946ef",
    },
    icon: "💜",
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] = useState<ThemeColor>("indigo");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [actualMode, setActualMode] = useState<"light" | "dark">("light");

  // Load saved preferences
  useEffect(() => {
    const savedColor = localStorage.getItem("theme-color") as ThemeColor;
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode;

    if (savedColor && themeColors[savedColor]) {
      setThemeColorState(savedColor);
    }

    if (savedMode) {
      setThemeModeState(savedMode);
    }
  }, []);

  // Handle system preference and mode changes
  useEffect(() => {
    const updateActualMode = () => {
      if (themeMode === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setActualMode(systemPrefersDark ? "dark" : "light");
      } else {
        setActualMode(themeMode);
      }
    };

    updateActualMode();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateActualMode);

    return () => mediaQuery.removeEventListener("change", updateActualMode);
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme color classes
    Object.keys(themeColors).forEach((color) => {
      root.classList.remove(`theme-${color}`);
    });

    // Add current theme color class
    root.classList.add(`theme-${themeColor}`);

    // Apply dark/light mode
    if (actualMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Update CSS variables
    const colors = themeColors[themeColor].primary;
    root.style.setProperty("--primary-start", colors.start);
    root.style.setProperty("--primary-mid", colors.mid);
    root.style.setProperty("--primary-end", colors.end);

    // Light/Dark Mode Specific Variables
    if (actualMode === "dark") {
      // Dark Mode Colors
      root.style.setProperty("--background", "#0a0f1e");
      root.style.setProperty("--foreground", "#f1f5f9");
      root.style.setProperty("--card-bg", "rgba(15, 23, 42, 0.85)");
      root.style.setProperty("--card-border", "rgba(51, 65, 85, 0.8)");

      // Glassmorphism - Dark
      root.style.setProperty("--glass-bg", "rgba(15, 23, 42, 0.7)");
      root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.1)");
      root.style.setProperty(
        "--glass-shadow",
        "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      );

      // Text Colors
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-secondary", "#cbd5e1");
      root.style.setProperty("--text-tertiary", "#94a3b8");

      // Shadows - Dark
      root.style.setProperty("--shadow-sm", "0 1px 2px 0 rgba(0, 0, 0, 0.3)");
      root.style.setProperty(
        "--shadow-md",
        "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)"
      );
      root.style.setProperty(
        "--shadow-lg",
        "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)"
      );
      root.style.setProperty(
        "--shadow-xl",
        "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)"
      );
      root.style.setProperty(
        "--shadow-glow",
        "0 0 30px rgba(139, 92, 246, 0.4)"
      );
    } else {
      // Light Mode Colors
      root.style.setProperty("--background", "#fafbfc");
      root.style.setProperty("--foreground", "#0f172a");
      root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.85)");
      root.style.setProperty("--card-border", "rgba(226, 232, 240, 0.8)");

      // Glassmorphism - Light
      root.style.setProperty("--glass-bg", "rgba(248, 250, 252, 0.7)");
      root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.18)");
      root.style.setProperty(
        "--glass-shadow",
        "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
      );

      // Text Colors
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--text-tertiary", "#64748b");

      // Shadows - Light
      root.style.setProperty("--shadow-sm", "0 1px 2px 0 rgba(0, 0, 0, 0.05)");
      root.style.setProperty(
        "--shadow-md",
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      );
      root.style.setProperty(
        "--shadow-lg",
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      );
      root.style.setProperty(
        "--shadow-xl",
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      );
      root.style.setProperty(
        "--shadow-glow",
        "0 0 20px rgba(99, 102, 241, 0.3)"
      );
    }

    // Semantic Colors (same for both modes, but can be customized)
    root.style.setProperty("--success", "#10b981");
    root.style.setProperty("--warning", "#f59e0b");
    root.style.setProperty("--error", "#ef4444");
    root.style.setProperty("--info", "#3b82f6");

    // Accent Colors
    root.style.setProperty("--accent-blue", "#3b82f6");
    root.style.setProperty("--accent-purple", "#a855f7");
    root.style.setProperty("--accent-pink", "#ec4899");
    root.style.setProperty("--accent-cyan", "#06b6d4");
    root.style.setProperty("--accent-emerald", "#10b981");
  }, [themeColor, actualMode]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem("theme-color", color);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem("theme-mode", mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeColor,
        themeMode,
        setThemeColor,
        setThemeMode,
        actualMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
