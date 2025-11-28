"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  href,
  label = "Back",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <div className={className}>
      <button
        onClick={() => router.push(href)}
        className="flex items-center gap-2 text-[var(--primary-start)] hover:text-[var(--primary-end)] transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        <span className="font-medium">{label}</span>
      </button>
    </div>
  );
}
