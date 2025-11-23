"use client";

import DeckBrowser from "./DeckBrowser";
import { useState, useEffect } from "react";
import FlashcardAdder from "./FlashcardAdder";
import { Flashcard } from "@/app/types/flashcard";
import { flashcardService } from "@/app/services/flashcard.service";
import { toast } from "react-hot-toast";

export default function DeckPageClient({ id }: { id: string }) {
  const [mode, setMode] = useState<"browse" | "add">("browse");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleAddFlashcard = (flashcard: Flashcard) => {
    setFlashcards((prevFlashcards) => [...prevFlashcards, flashcard]);
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const flashcards = await flashcardService.getFlashcards(id);
        setFlashcards(flashcards);
      } catch (error) {
        console.error("Failed to fetch flashcards", error);
        toast.error("Failed to load flashcards");
      }
    };
    fetchFlashcards();
  }, [id]);

  return (
    <div className="h-screen flex flex-col">
      <ul className="flex border-b border-gray-200 mb-4 h-10">
        <li
          className={`px-4 py-2 cursor-pointer ${
            mode === "browse"
              ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setMode("browse")}
        >
          Browse
        </li>
        <li
          className={`px-4 py-2 cursor-pointer ${
            mode === "add"
              ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setMode("add")}
        >
          Add
        </li>
      </ul>
      <div className="flex-1">
        {mode === "browse" && <DeckBrowser flashcards={flashcards} />}
        {mode === "add" && (
          <FlashcardAdder onAddFlashcard={handleAddFlashcard} />
        )}
      </div>
    </div>
  );
}
