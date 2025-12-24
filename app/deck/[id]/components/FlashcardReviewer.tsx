"use client";

import { useState, useEffect } from "react";
import { Flashcard } from "@/app/types/flashcard";
import { Deck } from "@/app/types/deck";
import { deckService } from "@/app/services/deck.service";
import { flashcardService } from "@/app/services/flashcard.service";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { calculateSM2, ratingToQuality } from "@/app/utils/sm2.algorithm";
import BackButton from "@/app/components/BackButton";

interface FlashcardReviewerProps {
  deckId: string;
}

export default function FlashcardReviewer({ deckId }: FlashcardReviewerProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewStartTime, setReviewStartTime] = useState<number>(Date.now());
  const [deck, setDeck] = useState<Deck | null>(null);
  const [stats, setStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [cardTypeStats, setCardTypeStats] = useState({
    reviewCards: 0,
    newCards: 0,
  });
  const [nextReviewDate, setNextReviewDate] = useState<string | null>(null);

  // Session-only undo stack (stores snapshots before a review action)
  const [undoStack, setUndoStack] = useState<any[]>([]);

  useEffect(() => {
    loadDueFlashcards();
  }, [deckId]);

  const loadDueFlashcards = async () => {
    try {
      setLoading(true);
      
      // Check localStorage for daily tracking
      const storageKey = `review_${deckId}`;
      const storedData = localStorage.getItem(storageKey);
      let dailyStats = { reviewDate: new Date().toISOString(), reviewedCount: 0, learnedCount: 0 };
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const reviewDate = new Date(parsedData.reviewDate);
        const now = new Date();
        const hoursDiff = (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff >= 24) {
          // Reset if more than 24 hours
          localStorage.removeItem(storageKey);
          localStorage.setItem(storageKey, JSON.stringify(dailyStats));
        } else {
          // Use existing stats
          dailyStats = parsedData;
        }
      } else {
        // Create new tracking
        localStorage.setItem(storageKey, JSON.stringify(dailyStats));
      }
      
      // Load deck information first
      const deckInfo = await deckService.getDeck(deckId);
      setDeck(deckInfo);
      
      // Get all due cards without limit first
      const allDueCards = await flashcardService.getDueFlashcards(deckId);
      console.log(allDueCards);

      if (allDueCards.length === 0) {
        setNextReviewDate(deckInfo.next_review_at || null);
      }

      // Separate review and new cards
      const reviewCards = allDueCards.filter(card => card.repetitions > 0);
      const newCards = allDueCards.filter(card => card.repetitions === 0);
      
      // Calculate remaining limits based on today's progress
      const maxReviewCards = deckInfo.review_cards_per_session || 10;
      const maxLearnCards = deckInfo.learn_cards_per_session || 20;
      const remainingReviewCards = Math.max(0, maxReviewCards - dailyStats.reviewedCount);
      const remainingLearnCards = Math.max(0, maxLearnCards - dailyStats.learnedCount);
      
      // Apply remaining limits
      const reviewLimit = Math.min(reviewCards.length, remainingReviewCards);
      const newLimit = Math.min(newCards.length, remainingLearnCards);
      
      const limitedReviewCards = reviewCards.slice(0, reviewLimit);
      const limitedNewCards = newCards.slice(0, newLimit);
      
      // Combine limited cards
      const dueCards = [...limitedReviewCards, ...limitedNewCards];
      
      // Calculate card type stats
      setCardTypeStats({
        reviewCards: limitedReviewCards.length,
        newCards: limitedNewCards.length,
      });

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

    // push snapshot for possible undo (session-only)
    const storageKey = `review_${deckId}`;
    const storedData = localStorage.getItem(storageKey);
    const dailyStatsSnapshot = storedData ? JSON.parse(storedData) : null;
    setUndoStack((s) => [
      ...s,
      {
        flashcards: [...flashcards],
        currentIndex,
        showAnswer,
        reviewStartTime,
        stats: { ...stats },
        cardTypeStats: { ...cardTypeStats },
        dailyStatsSnapshot,
      },
    ]);

    try {
      await flashcardService.reviewFlashcard(currentCard.id, {
        rating,
        timeTakenMs: timeTaken,
      });

      // Update localStorage counters
      const storageKey2 = `review_${deckId}`;
      const storedData2 = localStorage.getItem(storageKey2);

      if (storedData2) {
        const dailyStats = JSON.parse(storedData2);

        // Update appropriate counter based on card type
        if (currentCard.repetitions > 0) {
          dailyStats.reviewedCount++;
        } else {
          dailyStats.learnedCount++;
        }

        localStorage.setItem(storageKey2, JSON.stringify(dailyStats));
      }

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
        toast.success("You have finished reviewing all cards!");
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error("Failed to review flashcard", error);
      toast.error("Failed to save review");
    }
  };

  // Undo last review: call backend to revert and restore UI/localStorage snapshot
  const handleUndo = async () => {
    const last = undoStack[undoStack.length - 1];
    if (!last) return;

    // Identify the reviewed card (index before the review was applied)
    const reviewedIndex = last.currentIndex;
    const reviewedCard = last.flashcards[reviewedIndex];

    try {
      if (reviewedCard && reviewedCard.id) {
        await flashcardService.undoReview(reviewedCard.id);
      }

      // Restore UI state and localStorage snapshot
      setFlashcards(last.flashcards);
      setCurrentIndex(last.currentIndex);
      setShowAnswer(last.showAnswer);
      setReviewStartTime(last.reviewStartTime);
      setStats(last.stats);
      setCardTypeStats(last.cardTypeStats);
      if (last.dailyStatsSnapshot) {
        localStorage.setItem(`review_${deckId}`, JSON.stringify(last.dailyStatsSnapshot));
      }
      setUndoStack((s) => s.slice(0, -1));
      toast.success("Undid last review");
    } catch (error) {
      console.error("Failed to undo review", error);
      toast.error("Failed to undo review on server");
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

          {/* Card Type Summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {cardTypeStats.reviewCards}
              </div>
              <div className="text-xs text-blue-700">Review Cards</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {cardTypeStats.newCards}
              </div>
              <div className="text-xs text-green-700">New Cards</div>
            </div>
          </div>

          {/* Rating Stats */}
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
      <div className="flex items-center mb-4">
        {/* Back Button */}
        <BackButton href={`/deck`} label="Back to Deck" className="mr-4" />

        {/* Undo button shown when there is a session snapshot */}
        {undoStack.length > 0 && (
          <div className="ml-auto z-50">
              <button
                onClick={handleUndo}
                className="py-2 px-2 bg-[var(--primary-start)] text-[var(--text-primary)] rounded-md shadow-sm hover:bg-[var(--primary-end)] transition-colors"
              >
                Undo
              </button>
            </div>
        )}
      </div>
      
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

        {/* Card Type Stats */}
        <div className="flex gap-3 mt-3 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-blue-700 font-medium">{cardTypeStats.reviewCards} Review</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-green-700 font-medium">{cardTypeStats.newCards} New</span>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Front Side */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 min-h-[200px] flex flex-col">
            {/* Card Type Badge */}
            <div className="mb-4">
              {currentCard.repetitions > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Review Card
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  New Card
                </span>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              <p className="text-3xl font-bold text-gray-900 text-center">
                {currentCard.front_content}
              </p>
            </div>
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
