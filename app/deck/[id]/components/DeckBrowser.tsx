import { Flashcard } from "@/app/types/flashcard";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { flashcardService } from "@/app/services/flashcard.service";
import { toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";

interface DeckBrowserProps {
  flashcards: Flashcard[];
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onFlashcardUpdate: (updatedFlashcard: Flashcard) => void;
  onFlashcardDelete: (flashcardId: string) => void;
}

interface UpdateFlashcardFormData {
  front_content: string;
  back_content: string;
}

export default function DeckBrowser({
  flashcards,
  page,
  total,
  limit,
  onPageChange,
  onSearch,
  onFlashcardUpdate,
  onFlashcardDelete,
}: DeckBrowserProps) {
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateFlashcardFormData>();

  const totalPages = Math.ceil(total / limit);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleUpdateClick = () => {
    if (selectedFlashcard) {
      setValue("front_content", selectedFlashcard.front_content);
      setValue("back_content", selectedFlashcard.back_content);
      setIsUpdateModalOpen(true);
      setIsMenuOpen(false);
    }
  };

  const onSubmit: SubmitHandler<UpdateFlashcardFormData> = async (data) => {
    if (!selectedFlashcard) return;

    try {
      const updated = await flashcardService.updateFlashcard(
        selectedFlashcard.id,
        data
      );
      onFlashcardUpdate(updated);
      setSelectedFlashcard(updated);
      setIsUpdateModalOpen(false);
      toast.success("Flashcard updated successfully");
    } catch (error) {
      console.error("Failed to update flashcard", error);
      toast.error("Failed to update flashcard");
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFlashcard) return;

    try {
      await flashcardService.deleteFlashcard(selectedFlashcard.id);
      onFlashcardDelete(selectedFlashcard.id);
      setSelectedFlashcard(null);
      setIsDeleteModalOpen(false);
      toast.success("Flashcard deleted successfully");
    } catch (error) {
      console.error("Failed to delete flashcard", error);
      toast.error("Failed to delete flashcard");
    }
  };

  return (
    <div className="flex h-full">
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
              Update Flashcard
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Front Content
                </label>
                <textarea
                  {...register("front_content", {
                    required: "Front content is required",
                  })}
                  className={`w-full p-2 text-[var(--text-primary)] border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] ${
                    errors.front_content
                      ? "border-red-500"
                      : "border-[var(--text-primary)]"
                  }`}
                />
                {errors.front_content && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.front_content.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Back Content (Markdown supported)
                </label>
                <textarea
                  {...register("back_content", {
                    required: "Back content is required",
                  })}
                  className={`w-full p-2 text-[var(--text-primary)] border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px] ${
                    errors.back_content
                      ? "border-red-500"
                      : "border-[var(--text-primary)]"
                  }`}
                />
                {errors.back_content && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.back_content.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 text-[var(--text-primary)] bg-[var(--primary-mid)] rounded-md hover:bg-[var(--primary-start)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-[var(--text-primary)] bg-[var(--primary-mid)] rounded-md hover:bg-[var(--primary-start)]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
              Delete Flashcard
            </h3>
            <p className="text-[var(--text-primary)] mb-6">
              Are you sure you want to delete this flashcard? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-[var(--text-primary)] bg-[var(--primary-mid)] rounded-md hover:bg-[var(--primary-start)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <aside className="w-1/3 p-6 border-r border-[var(--glass-bg)] bg-[var(--glass-bg)] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
          Flashcards
        </h2>

        <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)]"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-[var(--primary-start)] text-[var(--text-primary)] rounded-md text-sm hover:bg-[var(--primary-mid)] transition-colors"
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
                      ? "bg-[var(--primary-start)] text-[var(--text-primary)] border-[var(--primary-mid)] shadow-md"
                      : "bg-[var(--glass-bg)] hover:bg-[var(--primary-mid)] hover:shadow-sm text-[var(--text-primary)]"
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
            <p className="text-[var(--text-primary)]">No flashcards found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 pt-4 border-t border-[var(--glass-bg)] flex justify-between items-center">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-[var(--glass-bg)] border border-[var(--glass-bg)] rounded-md text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--primary-mid)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 bg-[var(--glass-bg)] border border-[var(--glass-bg)] rounded-md text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--primary-mid)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </aside>
      <main className="w-2/3 p-6 relative bg-[var(--glass-bg)] flex flex-col overflow-y-auto h-full">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Flashcard Details
          </h2>
          <div className="relative">
            <button
              disabled={!selectedFlashcard}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-[var(--glass-bg)] transition-colors duration-200 text-[var(--text-primary)]"
            >
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

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--primary-start))]/50 backdrop-blur-xl rounded-md shadow-lg py-1 z-10 border border-[var(--glass-bg)]">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"
                  onClick={handleUpdateClick}
                >
                  Update
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        {selectedFlashcard ? (
          <div className="flex-grow flex flex-col justify-center items-center p-8 bg-[var(--glass-bg)] border border-[var(--glass-bg)] rounded-lg shadow-inner text-center">
            <div className="mb-8 p-6 bg-[var(--primary-start)]/50 rounded-lg shadow-md max-w-xl w-full">
              <p className="text-3xl font-extrabold text-[var(--text-primary)] leading-relaxed">
                {selectedFlashcard.front_content}
              </p>
            </div>
            <div className="p-6 bg-[var(--primary-start)]/50 rounded-lg shadow-md max-w-xl w-full text-left">
              <div className="text-xl text-[var(--text-primary)] leading-relaxed prose prose-blue max-w-none">
                <ReactMarkdown>
                  {selectedFlashcard.back_content.replace(/\n/g, "  \n")}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-[var(--text-primary)] text-lg">
            Select a flashcard to view details.
          </div>
        )}
      </main>
    </div>
  );
}
