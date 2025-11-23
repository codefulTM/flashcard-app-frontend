import { Flashcard } from "@/app/types/flashcard";
import { useState } from "react";

export default function DeckBrowser({
  flashcards,
}: {
  flashcards: Flashcard[];
}) {
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(
    null
  );
  return (
    <div className="flex h-full">
      <aside className="w-1/3 p-6 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Flashcards</h2>
        {flashcards.length > 0 ? (
          <ul className="space-y-3">
            {flashcards.map((flashcard) => (
              <li
                key={flashcard.id}
                onClick={() => setSelectedFlashcard(flashcard)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                ${
                  selectedFlashcard?.id === flashcard.id
                    ? "bg-blue-100 text-blue-800 border-blue-300 shadow-md"
                    : "bg-white hover:bg-gray-100 hover:shadow-sm"
                }`}
              >
                <p className="text-lg font-medium">
                  {flashcard.front_content.length > 70
                    ? flashcard.front_content.substring(0, 70) + "..."
                    : flashcard.front_content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No flashcards found.</p>
        )}
      </aside>
      <main className="w-2/3 p-6 relative bg-white flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Flashcard Details
          </h2>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
        {selectedFlashcard ? (
          <div className="flex-grow flex flex-col justify-center items-center p-8 bg-gray-50 border border-gray-200 rounded-lg shadow-inner text-center">
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md max-w-xl w-full">
              <p className="text-3xl font-extrabold text-gray-900 leading-relaxed">
                {selectedFlashcard.front_content}
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md max-w-xl w-full">
              <p className="text-xl text-gray-700 leading-relaxed">
                {selectedFlashcard.back_content}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500 text-lg">
            Select a flashcard to view details.
          </div>
        )}
      </main>
    </div>
  );
}
