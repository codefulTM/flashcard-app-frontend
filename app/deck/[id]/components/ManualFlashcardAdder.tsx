import { Flashcard } from "@/app/types/flashcard";

export default function ManualFlashcardAdder({
  onAddFlashcard,
}: {
  onAddFlashcard: (flashcard: Flashcard) => void;
}) {
  return (
    <div>
      <h2>Manual Flashcard Adder</h2>
    </div>
  );
}
