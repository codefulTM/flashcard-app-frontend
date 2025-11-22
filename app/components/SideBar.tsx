"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function SideBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/decks"
              className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200"
            >
              Decks
            </Link>
          </li>
          {user && (
            <li>
              <button
                onClick={() => logout()}
                className="w-full text-left block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
