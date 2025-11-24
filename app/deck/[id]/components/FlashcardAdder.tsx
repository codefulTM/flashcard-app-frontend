import { Flashcard } from "@/app/types/flashcard";
import { useState } from "react";
import ManualFlashcardAdder from "./ManualFlashcardAdder";
import AiFlashcardAdder from "./AiFlashcardAdder";

export default function FlashcardAdder({
  deckId,
  onAddFlashcard,
}: {
  deckId: string;
  onAddFlashcard: (flashcard: Flashcard) => void;
}) {
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 text-sm font-medium focus:outline-none ${
            mode === "manual"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setMode("manual")}
        >
          Manual Adder
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium focus:outline-none ${
            mode === "ai"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setMode("ai")}
        >
          AI Adder
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {mode === "manual" && (
          <ManualFlashcardAdder
            deckId={deckId}
            onAddFlashcard={onAddFlashcard}
          />
        )}
        {mode === "ai" && (
          <AiFlashcardAdder deckId={deckId} onAddFlashcard={onAddFlashcard} />
        )}
      </div>
    </div>
  );
}
