"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Deck, UpdateDeckDto } from "@/app/types/deck";
import { useState, useEffect } from "react";

interface UpdateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateDeckDto) => Promise<void>;
  deck: Deck | null;
}

export default function UpdateDeckModal({
  isOpen,
  onClose,
  onSubmit,
  deck,
}: UpdateDeckModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateDeckDto>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (deck) {
      setValue("name", deck.name);
      setValue("description", deck.description);
      setValue("is_public", deck.is_public);
      setValue("review_cards_per_session", deck.review_cards_per_session);
      setValue("learn_cards_per_session", deck.learn_cards_per_session);
    }
  }, [deck, setValue]);

  const onFormSubmit: SubmitHandler<UpdateDeckDto> = async (data) => {
    if (!deck) return;
    setSubmitError(null);
    try {
      // Convert to numbers if they're strings
      if (data.review_cards_per_session) {
        data.review_cards_per_session = Number(data.review_cards_per_session);
      }
      if (data.learn_cards_per_session) {
        data.learn_cards_per_session = Number(data.learn_cards_per_session);
      }
      await onSubmit(deck.id, data);
      reset();
      onClose();
    } catch (error: any) {
      console.error("Failed to update deck", error);
      setSubmitError("Failed to update deck. Please try again.");
    }
  };

  if (!isOpen || !deck) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-xl p-4 md:inset-0 h-screen max-h-full">
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-[var(--background)]/50 rounded-lg shadow backdrop-blur-xl">
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
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Update Deck
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
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Deck Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="What is this deck about?"
                  {...register("description")}
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="review_cards_per_session"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Review cards per session
                </label>
                <input
                  type="number"
                  id="review_cards_per_session"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="20"
                  {...register("review_cards_per_session", { min: 1 })}
                />
              </div>
              <div>
                <label
                  htmlFor="learn_cards_per_session"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Learn cards per session
                </label>
                <input
                  type="number"
                  id="learn_cards_per_session"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="10"
                  {...register("learn_cards_per_session", { min: 1 })}
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="is_public"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                    {...register("is_public")}
                  />
                </div>
                <label
                  htmlFor="is_public"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Make this deck public
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white bg-[var(--primary-start)] hover:bg-[var(--primary-end)] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[var(--primary-start)] dark:hover:bg-[var(--primary-end)] dark:focus:ring-blue-800 disabled:opacity-50"
              >
                {isSubmitting ? "Update Deck" : "Update Deck"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
