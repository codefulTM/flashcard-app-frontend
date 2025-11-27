"use client";

import { useState, useEffect } from "react";
import { Flashcard } from "@/app/types/flashcard";
import { deckService } from "@/app/services/deck.service";
import { flashcardService } from "@/app/services/flashcard.service";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { calculateSM2, ratingToQuality } from "@/app/utils/sm2.algorithm";

interface FlashcardReviewerProps {
  deckId: string;
}

export default function FlashcardReviewer({ deckId }: FlashcardReviewerProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewStartTime, setReviewStartTime] = useState<number>(Date.now());
  const [stats, setStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [nextReviewDate, setNextReviewDate] = useState<string | null>(null);

  useEffect(() => {
    loadDueFlashcards();
  }, [deckId]);

  const loadDueFlashcards = async () => {
    try {
      setLoading(true);
      const dueCards = await flashcardService.getDueFlashcards(deckId);
      console.log(dueCards);

      if (dueCards.length === 0) {
        const deck = await deckService.getDeck(deckId);
        setNextReviewDate(deck.next_review_at || null);
      }

      setFlashcards(dueCards);
      setCurrentIndex(0);
      setShowAnswer(false);
      setReviewStartTime(Date.now());
    } catch (error) {
      console.error("Failed to load due flashcards", error);
      toast.error("Failed to load flashcards for review");
    } finally {
      setLoading(false);
    }
  };

  const getPredictedInterval = (rating: number) => {
    if (!currentCard) return "";

    const quality = ratingToQuality(rating);
    const result = calculateSM2({
      quality,
      repetitions: currentCard.repetitions || 0,
      easeFactor: currentCard.ease_factor || 2.5,
      interval: currentCard.interval || 0,
    });

    if (result.interval === 0) return "10 min";
    return `${result.interval} day${result.interval !== 1 ? "s" : ""}`;
  };

  const handleReview = async (rating: number) => {
    if (currentIndex >= flashcards.length) return;

    const currentCard = flashcards[currentIndex];
    const timeTaken = Date.now() - reviewStartTime;

    try {
      await flashcardService.reviewFlashcard(currentCard.id, {
        rating,
        timeTakenMs: timeTaken,
      });

      // Update stats
      const ratingNames = ["again", "hard", "good", "easy"] as const;
      setStats((prev) => ({
        ...prev,
        [ratingNames[rating - 1]]: prev[ratingNames[rating - 1]] + 1,
      }));

      // Move to next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setReviewStartTime(Date.now());
      } else {
        try {
          setLoading(true);
          const nextDueCards = await flashcardService.getDueFlashcards(deckId);

          if (nextDueCards.length > 0) {
            toast.success("You have more cards due for review!");
            setFlashcards(nextDueCards);
            setCurrentIndex(0);
            setShowAnswer(false);
            setReviewStartTime(Date.now());
          } else {
            toast.success("You have finished reviewing all cards!");
            setCurrentIndex(currentIndex + 1);
          }
        } catch (error) {
          console.error("Failed to check for more due flashcards", error);
          setCurrentIndex(currentIndex + 1);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to review flashcard", error);
      toast.error("Failed to save review");
    }
  };

  const currentCard = flashcards[currentIndex];
  const isCompleted = currentIndex >= flashcards.length;
  const progress =
    flashcards.length > 0
      ? ((currentIndex / flashcards.length) * 100).toFixed(0)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto mb-4 text-[var(--primary-start)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            All caught up!
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            No flashcards are due for review right now.
          </p>
          {nextReviewDate && (
            <div className="text-[var(--text-primary)] text-lg font-medium">
              {(() => {
                const date = new Date(nextReviewDate);
                const now = new Date();
                const diff = date.getTime() - now.getTime();

                if (diff <= 0) return "You have cards due now!";

                const minutes = Math.floor(diff / 60000);
                if (minutes < 60) return `Next review in ${minutes} minutes`;

                const hours = Math.floor(minutes / 60);
                if (hours < 24) return `Next review in ${hours} hours`;

                const days = Math.floor(hours / 24);
                return `Next review in ${days} days`;
              })()}
            </div>
          )}
          <button
            onClick={() => (window.location.href = `/deck`)}
            className="mt-6 px-6 py-2 bg-[var(--primary-end)] text-[var(--text-primary)] rounded-full font-semibold hover:bg-[var(--primary-start)] transition-colors"
          >
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Review Complete!
          </h3>
          <p className="text-white mb-6">
            You've reviewed {flashcards.length} flashcard
            {flashcards.length !== 1 ? "s" : ""}.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {stats.again}
              </div>
              <div className="text-sm text-red-700">Again</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.hard}
              </div>
              <div className="text-sm text-orange-700">Hard</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.good}
              </div>
              <div className="text-sm text-green-700">Good</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.easy}
              </div>
              <div className="text-sm text-blue-700">Easy</div>
            </div>
          </div>

          <button
            onClick={loadDueFlashcards}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Review Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[var(--primary-start)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Front Side */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 min-h-[200px] flex items-center justify-center">
            <p className="text-3xl font-bold text-gray-900 text-center">
              {currentCard.front_content}
            </p>
          </div>

          {/* Show Answer Button or Answer */}
          {!showAnswer ? (
            <div className="text-center">
              <button
                onClick={() => setShowAnswer(true)}
                className="px-8 py-4 bg-[var(--primary-start)] text-white text-lg font-semibold rounded-lg hover:bg-[var(--primary-end)] transition-colors shadow-md"
              >
                Show Answer
              </button>
            </div>
          ) : (
            <>
              {/* Back Side */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-6 min-h-[200px] text-black overflow-y-auto">
                <div className="prose prose-blue max-w-none">
                  <ReactMarkdown>
                    {currentCard.back_content.replace(/\n/g, "  \n")}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Rating Buttons */}
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => handleReview(1)}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md flex flex-col items-center"
                >
                  <span className="text-lg font-bold">Again</span>
                  <span className="text-xs opacity-90">
                    {getPredictedInterval(1)}
                  </span>
                </button>
                <button
                  onClick={() => handleReview(2)}
                  className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md flex flex-col items-center"
                >
                  <span className="text-lg font-bold">Hard</span>
                  <span className="text-xs opacity-90">
                    {getPredictedInterval(2)}
                  </span>
                </button>
                <button
                  onClick={() => handleReview(3)}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md flex flex-col items-center"
                >
                  <span className="text-lg font-bold">Good</span>
                  <span className="text-xs opacity-90">
                    {getPredictedInterval(3)}
                  </span>
                </button>
                <button
                  onClick={() => handleReview(4)}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md flex flex-col items-center"
                >
                  <span className="text-lg font-bold">Easy</span>
                  <span className="text-xs opacity-90">
                    {getPredictedInterval(4)}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
