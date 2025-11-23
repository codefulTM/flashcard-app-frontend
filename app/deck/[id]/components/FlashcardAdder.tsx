import { Flashcard } from "@/app/types/flashcard";
import { useState } from "react";
import ManualFlashcardAdder from "./ManualFlashcardAdder";
import AiFlashcardAdder from "./AiFlashcardAdder";

export default function FlashcardAdder({
  onAddFlashcard,
}: {
  onAddFlashcard: (flashcard: Flashcard) => void;
}) {
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  return (
    <div className="h-full">
      <ul>
        <li onClick={() => setMode("manual")}>Manual mode</li>
        <li onClick={() => setMode("ai")}>AI mode</li>
      </ul>
      {mode === "manual" && (
        <ManualFlashcardAdder onAddFlashcard={onAddFlashcard} />
      )}
      {mode === "ai" && <AiFlashcardAdder onAddFlashcard={onAddFlashcard} />}
    </div>
  );
}
