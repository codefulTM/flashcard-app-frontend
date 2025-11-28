"use client";

import DeckBrowser from "./DeckBrowser";

import { useState, useEffect } from "react";
import FlashcardAdder from "./FlashcardAdder";
import { Flashcard } from "@/app/types/flashcard";
import { flashcardService } from "@/app/services/flashcard.service";
import { toast } from "react-hot-toast";
import BackButton from "@/app/components/BackButton";

export default function DeckPageClient({ id }: { id: string }) {
  const [mode, setMode] = useState<"browse" | "add">("browse");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [search, setSearch] = useState("");

  const handleAddFlashcard = (flashcard: Flashcard) => {
    setFlashcards((prevFlashcards) => [flashcard, ...prevFlashcards]);
    setTotal((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await flashcardService.getFlashcards(
          id,
          page,
          limit,
          search
        );
        setFlashcards(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch flashcards", error);
        toast.error("Failed to load flashcards");
      }
    };
    fetchFlashcards();
  }, [id, page, search]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1); // Reset to first page on new search
  };

  const handleFlashcardUpdate = (updatedFlashcard: Flashcard) => {
    setFlashcards((prev) =>
      prev.map((f) => (f.id === updatedFlashcard.id ? updatedFlashcard : f))
    );
  };

  const handleFlashcardDelete = (flashcardId: string) => {
    setFlashcards((prev) => prev.filter((f) => f.id !== flashcardId));
    setTotal((prev) => prev - 1);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Back Button */}
      <BackButton
        href="/deck"
        label="Back to Decks"
        className="bg-[var(--background)] border-b border-[var(--primary-end)] px-4 py-3 flex-shrink-0"
      />

      <ul className="flex border-b border-[var(--primary-end)] h-10 z-50 sticky top-0 bg-[var(--primary-start)] flex-shrink-0">
        <li
          className={`px-4 py-2 cursor-pointer ${
            mode === "browse"
              ? "border-b-2 border-[var(--primary-end)] text-[var(--text-primary)] font-semibold"
              : "text-[var(--text-secondary)]"
          }`}
          onClick={() => setMode("browse")}
        >
          Browse
        </li>
        <li
          className={`px-4 py-2 cursor-pointer ${
            mode === "add"
              ? "border-b-2 border-[var(--primary-end)] text-[var(--text-primary)] font-semibold"
              : "text-[var(--text-secondary)]"
          }`}
          onClick={() => setMode("add")}
        >
          Add
        </li>
      </ul>
      <div className="flex-1 overflow-hidden">
        {mode === "browse" && (
          <DeckBrowser
            flashcards={flashcards}
            page={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onSearch={handleSearch}
            onFlashcardUpdate={handleFlashcardUpdate}
            onFlashcardDelete={handleFlashcardDelete}
          />
        )}
        {mode === "add" && (
          <FlashcardAdder deckId={id} onAddFlashcard={handleAddFlashcard} />
        )}
      </div>
    </div>
  );
}
