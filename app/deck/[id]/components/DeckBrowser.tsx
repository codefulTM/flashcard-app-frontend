import { Flashcard } from "@/app/types/flashcard";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface DeckBrowserProps {
  flashcards: Flashcard[];
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
}

export default function DeckBrowser({
  flashcards,
  page,
  total,
  limit,
  onPageChange,
  onSearch,
}: DeckBrowserProps) {
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = Math.ceil(total / limit);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="flex h-full">
      <aside className="w-1/3 p-6 border-r border-gray-200 bg-gray-50 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Flashcards</h2>

        <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex-1 overflow-y-auto">
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
                      : "bg-white hover:bg-gray-100 hover:shadow-sm text-black"
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
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </aside>
      <main className="w-2/3 p-6 relative bg-white flex flex-col overflow-y-auto h-full">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
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
            <div className="p-6 bg-white rounded-lg shadow-md max-w-xl w-full text-left">
              <div className="text-xl text-gray-700 leading-relaxed prose prose-blue max-w-none">
                <ReactMarkdown>{selectedFlashcard.back_content}</ReactMarkdown>
              </div>
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
