"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function SideBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/deck", label: "Decks", icon: "📚" },
  ];

  return (
    <aside className="w-72 fixed left-0 top-0 h-screen glass-card border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-start)] via-[var(--primary-mid)] to-[var(--primary-end)] flex items-center justify-center shadow-lg shadow-[var(--primary-start)]/30 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <div>
            <h1 className="text-xl font-black gradient-text">Flashcard</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Learn Smarter
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[var(--primary-start)] via-[var(--primary-mid)] to-[var(--primary-end)] text-white shadow-lg shadow-[var(--primary-start)]/30"
                      : "hover:bg-[var(--glass-bg)] dark:hover:bg-[var(--glass-bg)] text-[var(--text-primary)] dark:text-[var(--text-primary)]"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* Theme Toggle */}
        <div className="flex justify-center">
          <ThemeToggle />
        </div>

        {/* User Info & Logout */}
        {user && (
          <div className="space-y-2">
            <div className="px-4 py-3 rounded-xl bg-[var(--glass-bg)] dark:bg-[var(--glass-bg)]">
              <p className="text-xs text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-1">
                Signed in as
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
