import { Flashcard } from "@/app/types/flashcard";

export default function AiFlashcardAdder({
  onAddFlashcard,
}: {
  onAddFlashcard: (flashcard: Flashcard) => void;
}) {
  return (
    <div>
      <h2>AI Flashcard Adder</h2>
    </div>
  );
}
