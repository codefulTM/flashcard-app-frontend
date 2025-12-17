"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { Deck } from "@/app/types/deck";
import { deckService } from "@/app/services/deck.service";

import CreateDeckModal from "./CreateDeckModal";
import { CreateDeckDto } from "@/app/types/deck";
import { toast } from "react-hot-toast";

import DeckOptionsDropdown from "./DeckOptionsDropdown";
import UpdateDeckModal from "./UpdateDeckModal";
import CustomStudyDialog from "./CustomStudyDialog";
import { UpdateDeckDto } from "@/app/types/deck";
import { useRouter } from "next/navigation";

export default function DeckPageClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCustomStudyDialogOpen, setIsCustomStudyDialogOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchDecks = async () => {
      try {
        const decks = await deckService.getDecks(user.id);
        setDecks(decks);
      } catch (error) {
        console.error("Failed to fetch decks", error);
        toast.error("Failed to load decks");
      }
    };
    fetchDecks();
  }, [user]);

  const handleCreateDeck = async (data: CreateDeckDto) => {
    if (!user) return;
    try {
      const newDeck = await deckService.createDeck(data, user.id);
      setDecks([...decks, newDeck]);
      toast.success("Deck created successfully!");
    } catch (error) {
      console.error("Failed to create deck", error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const handleUpdateDeck = async (id: string, data: UpdateDeckDto) => {
    try {
      const updatedDeck = await deckService.updateDeck(id, data);
      setDecks(decks.map((d) => (d.id === id ? updatedDeck : d)));
      toast.success("Deck updated successfully!");
    } catch (error) {
      console.error("Failed to update deck", error);
      throw error;
    }
  };

  const toggleDropdown = (deckId: string) => {
    if (activeDropdownId === deckId) {
      setActiveDropdownId(null);
    } else {
      setActiveDropdownId(deckId);
    }
  };

  const handleUpdate = (deckId: string) => {
    const deckToUpdate = decks.find((d) => d.id === deckId);
    if (deckToUpdate) {
      setSelectedDeck(deckToUpdate);
      setIsUpdateModalOpen(true);
    }
    setActiveDropdownId(null);
  };

  const handleBrowse = (deckId: string) => {
    console.log("Browse deck", deckId);
    setActiveDropdownId(null);
    // TODO: Implement browse logic
    router.push(`/deck/${deckId}`);
  };

  const handleDelete = async (deckId: string) => {
    if (confirm("Are you sure you want to delete this deck?")) {
      try {
        await deckService.deleteDeck(deckId);
        setDecks(decks.filter((d) => d.id !== deckId));
        toast.success("Deck deleted successfully");
      } catch (error) {
        console.error("Failed to delete deck", error);
        toast.error("Failed to delete deck");
      }
    }
    setActiveDropdownId(null);
  };

  const handleCustomStudy = (deckId: string) => {
    const deck = decks.find((d) => d.id === deckId);
    if (deck) {
      setSelectedDeck(deck);
      setIsCustomStudyDialogOpen(true);
    }
    setActiveDropdownId(null);
  };

  const handleCreateCustomStudy = async (days: number) => {
    if (!user || !selectedDeck) return;
    try {
      const customDeck = await deckService.createCustomStudyDeck(
        selectedDeck.id,
        user.id,
        days
      );
      const totalCards = customDeck.review_cards_per_session + customDeck.learn_cards_per_session;
      toast.success(
        `Custom study session created! ${customDeck.review_cards_per_session} review card(s) and ${customDeck.learn_cards_per_session} new card(s) (${totalCards} total)`
      );
      // Navigate to the custom study deck review page
      router.push(`/deck/${customDeck.id}/review`);
    } catch (error: any) {
      console.error("Failed to create custom study session", error);
      toast.error(
        error.response?.data?.message || "Failed to create custom study session"
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--primary-start)]">
          Your Decks
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-start)] text-white rounded-md hover:bg-[var(--primary-end)] transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Deck
        </button>
      </div>
      <div className="space-y-3">
        {decks.map((deck) => (
          <div
            className="relative flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            key={deck.id}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {deck.name}
                </h2>
                {deck.is_custom_study && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    Custom Study
                  </span>
                )}
              </div>
              {deck.description && (
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {deck.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {deck.next_review_at
                  ? (() => {
                    const date = new Date(deck.next_review_at);
                    const now = new Date();
                    const diff = date.getTime() - now.getTime();

                    if (diff <= 0)
                      return (
                        <span className="text-green-600 font-medium">
                          Cards due now!
                        </span>
                      );

                    const minutes = Math.floor(diff / 60000);
                    if (minutes < 60) return `Next review in ${minutes}m`;

                    const hours = Math.floor(minutes / 60);
                    if (hours < 24) return `Next review in ${hours}h`;

                    const days = Math.floor(hours / 24);
                    return `Next review in ${days}d`;
                  })()
                  : "No cards due"}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                className="px-4 py-2 bg-[var(--primary-start)] text-white rounded-md hover:bg-[var(--primary-end)] transition-colors whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/deck/${deck.id}/review`);
                }}
              >
                Learn
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(deck.id);
                }}
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
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </button>
              <DeckOptionsDropdown
                isOpen={activeDropdownId === deck.id}
                onClose={() => setActiveDropdownId(null)}
                onUpdate={() => handleUpdate(deck.id)}
                onBrowse={() => handleBrowse(deck.id)}
                onDelete={() => handleDelete(deck.id)}
                onCustomStudy={() => handleCustomStudy(deck.id)}
                isCustomStudy={deck.is_custom_study}
              />
            </div>
          </div>
        ))}
      </div>
      <CreateDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDeck}
      />
      <UpdateDeckModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateDeck}
        deck={selectedDeck}
      />
      <CustomStudyDialog
        isOpen={isCustomStudyDialogOpen}
        onClose={() => setIsCustomStudyDialogOpen(false)}
        onSubmit={handleCreateCustomStudy}
        deckName={selectedDeck?.name || ""}
      />
    </div>
  );
}
