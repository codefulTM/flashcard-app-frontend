"use client";

import { useEffect, useRef } from "react";

interface DeckOptionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onBrowse: () => void;
  onCustomStudy: () => void;
  isCustomStudy?: boolean;
}

export default function DeckOptionsDropdown({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onBrowse,
  onCustomStudy,
  isCustomStudy = false,
}: DeckOptionsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-8 right-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
    >
      <ul className="py-1">
        <li>
          <button
            onClick={onUpdate}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Update
          </button>
        </li>
        <li>
          <button
            onClick={onBrowse}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Browse
          </button>
        </li>
        <li>
          <button
            onClick={onCustomStudy}
            disabled={isCustomStudy}
            className={`block w-full text-left px-4 py-2 text-sm ${
              isCustomStudy
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            title={
              isCustomStudy
                ? "Cannot create custom study from a custom study deck"
                : ""
            }
          >
            Custom Study
          </button>
        </li>
        <li>
          <button
            onClick={onDelete}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}
