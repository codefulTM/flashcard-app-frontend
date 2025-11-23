import apiClient from "../lib/api-client";
import { CreateDeckDto, Deck, UpdateDeckDto } from "../types/deck";

export const deckService = {
  async getDecks(userId: string): Promise<Deck[]> {
    const response = await apiClient.get<Deck[]>("/decks", {
      params: { userId },
    });
    return response.data;
  },

  async getDeck(id: string): Promise<Deck> {
    const response = await apiClient.get<Deck>(`/decks/${id}`);
    return response.data;
  },

  async createDeck(data: CreateDeckDto, userId: string): Promise<Deck> {
    const response = await apiClient.post<Deck>("/decks", {
      ...data,
      userId,
    });
    return response.data;
  },

  async updateDeck(id: string, data: UpdateDeckDto): Promise<Deck> {
    const response = await apiClient.patch<Deck>(`/decks/${id}`, data);
    return response.data;
  },

  async deleteDeck(id: string): Promise<void> {
    await apiClient.delete(`/decks/${id}`);
  },
};
