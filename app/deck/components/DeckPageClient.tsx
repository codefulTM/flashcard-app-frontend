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
import { UpdateDeckDto } from "@/app/types/deck";
import { useRouter } from "next/navigation";

export default function DeckPageClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Your Decks</h1>
      <div className="flex flex-wrap gap-4">
        <button
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors w-48 h-48"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="text-5xl">+</span>
          <span className="mt-2 text-lg">New Deck</span>
        </button>
        {decks.map((deck) => (
          <div
            className="relative flex flex-col justify-between p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-48 h-48"
            key={deck.id}
          >
            <button
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700 transition-colors"
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
            />
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {deck.name}
            </h2>
            <button
              className="mt-4 mx-auto w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors self-end"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/deck/${deck.id}/review`);
              }}
            >
              Learn
            </button>
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
    </div>
  );
}
