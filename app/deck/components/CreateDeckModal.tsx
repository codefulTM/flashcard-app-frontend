"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { CreateDeckDto } from "@/app/types/deck";
import { useState } from "react";

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDeckDto) => Promise<void>;
}

export default function CreateDeckModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateDeckModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateDeckDto>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onFormSubmit: SubmitHandler<CreateDeckDto> = async (data) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error: any) {
      console.error("Failed to create deck", error);
      setSubmitError("Failed to create deck. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 md:inset-0 h-screen max-h-full">
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-[var(--glass-bg)] rounded-lg shadow dark:bg-[var(--glass-bg)] backdrop-blur-xl">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-[var(--text-primary)]">
              Create a new deck
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
              {submitError && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                  {submitError}
                </div>
              )}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                >
                  Deck Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] text-sm rounded-lg focus:ring-[var(--primary-start)] focus:border-[var(--primary-start)] block w-full p-2.5"
                  placeholder="e.g., Biology 101"
                  {...register("name", { required: "Deck name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] text-sm rounded-lg focus:ring-[var(--primary-start)] focus:border-[var(--primary-start)] block w-full p-2.5"
                  placeholder="What is this deck about?"
                  {...register("description")}
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="review_cards_per_session"
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                >
                  Review cards per session (Optional)
                </label>
                <input
                  type="number"
                  id="review_cards_per_session"
                  className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] text-sm rounded-lg focus:ring-[var(--primary-start)] focus:border-[var(--primary-start)] block w-full p-2.5"
                  placeholder="20"
                  {...register("review_cards_per_session", { min: 1 })}
                />
              </div>
              <div>
                <label
                  htmlFor="learn_cards_per_session"
                  className="block mb-2 text-sm font-medium text-[var(--text-primary)]"
                >
                  Learn cards per session (Optional)
                </label>
                <input
                  type="number"
                  id="learn_cards_per_session"
                  className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] text-sm rounded-lg focus:ring-[var(--primary-start)] focus:border-[var(--primary-start)] block w-full p-2.5"
                  placeholder="10"
                  {...register("learn_cards_per_session", { min: 1 })}
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="is_public"
                    type="checkbox"
                    className="w-4 h-4 border border-[var(--glass-border)] rounded bg-[var(--glass-bg)] focus:ring-3 focus:ring-[var(--primary-start)]"
                    {...register("is_public")}
                  />
                </div>
                <label
                  htmlFor="is_public"
                  className="ml-2 text-sm font-medium text-[var(--text-primary)]"
                >
                  Make this deck public
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-[var(--text-primary)] bg-[var(--primary-start)] hover:bg-[var(--primary-end)] focus:ring-4 focus:outline-none focus:ring-[var(--primary-start)] font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Deck"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
