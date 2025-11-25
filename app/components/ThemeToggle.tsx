"use client";

import {
  useTheme,
  themeColors,
  type ThemeColor,
  type ThemeMode,
} from "../context/ThemeContext";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    bottom: 0,
    left: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { themeColor, themeMode, setThemeColor, setThemeMode } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        bottom: window.innerHeight - rect.top - 20, // 8px gap above button
        left: rect.left,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("#theme-toggle") &&
        !target.closest("#theme-dropdown")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  if (!mounted) {
    return (
      <button className="p-3 rounded-xl glass-card">
        <div className="w-5 h-5" />
      </button>
    );
  }

  const modes: { name: string; value: ThemeMode; icon: string }[] = [
    { name: "Light", value: "light", icon: "☀️" },
    { name: "Dark", value: "dark", icon: "🌙" },
    { name: "System", value: "system", icon: "💻" },
  ];

  const currentModeIcon =
    modes.find((m) => m.value === themeMode)?.icon || "💻";

  // Dropdown content
  const dropdownContent = isOpen ? (
    <div
      id="theme-dropdown"
      className="fixed w-72 bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl shadow-2xl animate-scaleIn overflow-hidden border border-[var(--glass-border)] z-[99999]"
      style={{
        bottom: `${dropdownPosition.bottom}px`,
        left: `${dropdownPosition.left}px`,
      }}
    >
      {/* Mode Selection */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Mode
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setThemeMode(mode.value)}
              className={`p-3 rounded-xl text-center transition-all duration-200 ${
                themeMode === mode.value
                  ? "bg-gradient-to-br from-[var(--primary-start)] to-[var(--primary-end)] text-white shadow-lg scale-105"
                  : "bg-[var(--glass-bg)] dark:bg-[var(--glass-bg)] hover:bg-gradient-to-br hover:from-[var(--primary-start)] hover:to-[var(--primary-end)] hover:text-white dark:hover:bg-[var(--glass-bg)]"
              }`}
            >
              <div className="text-2xl mb-1">{mode.icon}</div>
              <div className="text-xs font-semibold">{mode.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="p-4">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Color Theme
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(themeColors) as ThemeColor[]).map((color) => {
            const theme = themeColors[color];
            return (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`group relative p-3 rounded-xl text-center transition-all duration-200 ${
                  themeColor === color
                    ? "ring-2 ring-offset-2 ring-[var(--primary-start)] dark:ring-offset-gray-900 scale-105"
                    : "hover:scale-105"
                }`}
                // Set custom CSS variables for each button to represent its specific theme color
                style={
                  {
                    "--btn-primary-start": theme.primary.start,
                    "--btn-primary-mid": theme.primary.mid,
                    "--btn-primary-end": theme.primary.end,
                    background: `linear-gradient(135deg, var(--btn-primary-start), var(--btn-primary-mid), var(--btn-primary-end))`,
                  } as React.CSSProperties
                }
              >
                <div className="text-2xl mb-1 filter drop-shadow-lg">
                  {theme.icon}
                </div>
                <div className="text-xs font-bold text-white drop-shadow-md">
                  {theme.name}
                </div>
                {themeColor === color && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-[var(--glass-bg)] dark:bg-[var(--glass-bg)] border-t border-[var(--glass-bg)] dark:border-[var(--glass-bg)]">
        <div className="text-xs text-[var(--text-primary)] dark:text-gray-400 mb-2 font-semibold">
          Preview
        </div>
        <div className="flex gap-2">
          {/* These previews should reflect the *currently selected* theme, which is already set on :root as CSS variables */}
          <div
            className="flex-1 h-8 rounded-lg shadow-inner"
            style={{
              background: `linear-gradient(135deg, var(--primary-start), var(--primary-mid))`,
            }}
          />
          <div
            className="flex-1 h-8 rounded-lg shadow-inner"
            style={{
              background: `linear-gradient(135deg, var(--primary-mid), var(--primary-end))`,
            }}
          />
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative" id="theme-toggle">
        {/* Toggle Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="group relative p-3 rounded-xl glass-card hover-lift hover-glow transition-all duration-300 flex items-center gap-2"
          aria-label="Toggle theme"
        >
          <span className="text-xl">{currentModeIcon}</span>
          <span className="text-2xl">{themeColors[themeColor].icon}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Render dropdown using Portal - outside of sidebar DOM hierarchy */}
      {mounted &&
        dropdownContent &&
        createPortal(dropdownContent, document.body)}
    </>
  );
}
