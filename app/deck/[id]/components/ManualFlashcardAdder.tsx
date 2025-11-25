import { Flashcard, CreateFlashcardDto } from "@/app/types/flashcard";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { flashcardService } from "@/app/services/flashcard.service";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface ManualFlashcardAdderProps {
  deckId: string;
  onAddFlashcard: (flashcard: Flashcard) => void;
}

interface FormValues {
  flashcards: {
    front_content: string;
    back_content: string;
  }[];
}

export default function ManualFlashcardAdder({
  deckId,
  onAddFlashcard,
}: ManualFlashcardAdderProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      flashcards: [{ front_content: "", back_content: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "flashcards",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const promises = data.flashcards.map((card) =>
        flashcardService.createFlashcard({
          deck_id: deckId,
          front_content: card.front_content,
          back_content: card.back_content,
        })
      );

      const newFlashcards = await Promise.all(promises);
      newFlashcards.forEach((card) => onAddFlashcard(card));

      toast.success(`Successfully added ${newFlashcards.length} flashcards!`);
      reset({ flashcards: [{ front_content: "", back_content: "" }] });
    } catch (error) {
      console.error("Failed to add flashcards", error);
      toast.error("Failed to add some flashcards. Please try again.");
    }
  };

  return (
    <div className="px-6 bg-[var(--glass-bg)] h-full overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-[var(--glass-bg)] py-2 z-10">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Add Flashcards Manually
          </h2>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[var(--primary-start)] text-[var(--text-primary)] rounded-md hover:bg-[var(--primary-mid)] transition-colors disabled:opacity-50 shadow-md"
          >
            {isSubmitting ? "Adding..." : "Add All Flashcards"}
          </button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-6 bg-[var(--primary-start)]/50 rounded-lg shadow-md border border-[var(--glass-bg)] relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Card {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Front (Question/Term)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-[var(--glass-bg)] rounded-md focus:ring-blue-500 focus:border-blue-500 text-[var(--text-primary)]"
                    placeholder="Enter the question or term..."
                    {...register(`flashcards.${index}.front_content` as const, {
                      required: "Front content is required",
                    })}
                  />
                  {errors.flashcards?.[index]?.front_content && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.flashcards[index]?.front_content?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Back (Answer/Definition)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-[var(--glass-bg)] rounded-md focus:ring-blue-500 focus:border-blue-500 text-[var(--text-primary)]"
                    placeholder="Enter the answer or definition..."
                    {...register(`flashcards.${index}.back_content` as const, {
                      required: "Back content is required",
                    })}
                  />
                  {errors.flashcards?.[index]?.back_content && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.flashcards[index]?.back_content?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center pb-8">
          <button
            type="button"
            onClick={() => append({ front_content: "", back_content: "" })}
            className="flex items-center justify-center w-12 h-12 bg-[var(--primary-start)] text-[var(--text-primary)] rounded-full hover:bg-[var(--primary-start)]/50 transition-colors shadow-sm"
            title="Add another card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
