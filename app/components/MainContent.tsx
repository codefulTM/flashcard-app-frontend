"use client";

import { usePathname } from "next/navigation";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <main className={`flex-1 ${!isAuthPage ? "ml-72" : ""}`}>{children}</main>
  );
}
