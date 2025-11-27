"use client";

import { useState } from "react";

interface CustomStudyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (days: number) => void;
  deckName: string;
}

export default function CustomStudyDialog({
  isOpen,
  onClose,
  onSubmit,
  deckName,
}: CustomStudyDialogProps) {
  const [days, setDays] = useState<number>(7);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (days > 0) {
      onSubmit(days);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--glass-bg)] backdrop-blur-xl rounded-lg p-6 w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
          Custom Study
        </h2>
        <p className="text-[var(--text-secondary)] mb-4">
          Create a custom study session for <strong>{deckName}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="days"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Study cards due in the next:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="days"
                min="1"
                max="365"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-start)] text-[var(--text-primary)]"
              />
              <span className="text-[var(--text-primary)] font-medium">
                day(s)
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              This will include all cards with review dates from today to {days}{" "}
              day(s) from now.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary-start)] text-white rounded-md hover:bg-[var(--primary-end)] transition-colors"
            >
              Create Study Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
