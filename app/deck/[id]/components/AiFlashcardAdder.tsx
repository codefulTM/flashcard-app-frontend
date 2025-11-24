import { Flashcard } from "@/app/types/flashcard";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { flashcardService } from "@/app/services/flashcard.service";
import { toast } from "react-hot-toast";

interface AiFlashcardAdderProps {
  deckId: string;
  onAddFlashcard: (flashcard: Flashcard) => void;
}

interface FormValues {
  flashcards: {
    front_content: string;
  }[];
}

export default function AiFlashcardAdder({
  deckId,
  onAddFlashcard,
}: AiFlashcardAdderProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      flashcards: [{ front_content: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "flashcards",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const promises = data.flashcards.map((card) =>
        flashcardService.generateFlashcard(deckId, card.front_content)
      );

      const newFlashcards = await Promise.all(promises);
      newFlashcards.forEach((card) => onAddFlashcard(card));

      toast.success(
        `Successfully generated and added ${newFlashcards.length} flashcards!`
      );
      reset({ flashcards: [{ front_content: "" }] });
    } catch (error) {
      console.error("Failed to generate flashcards", error);
      toast.error("Failed to generate some flashcards. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 py-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Flashcards with AI
          </h2>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
                Generate All
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-6 bg-white rounded-lg shadow-md border border-gray-200 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Card {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front (Question/Term)
                </label>
                <textarea
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-black"
                  placeholder="Enter the term you want AI to define..."
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
              <div className="mt-2 text-sm text-gray-500 italic">
                * AI will automatically generate the back content for this card.
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center pb-8">
          <button
            type="button"
            onClick={() => append({ front_content: "" })}
            className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors shadow-sm"
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
