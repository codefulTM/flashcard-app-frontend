import apiClient from "../lib/api-client";
import {
  CreateFlashcardDto,
  Flashcard,
  UpdateFlashcardDto,
} from "../types/flashcard";

export const flashcardService = {
  async getFlashcards(deckId: string): Promise<Flashcard[]> {
    const response = await apiClient.get<Flashcard[]>("/flashcards", {
      params: { deckId },
    });
    return response.data;
  },

  async getFlashcard(id: string): Promise<Flashcard> {
    const response = await apiClient.get<Flashcard>(`/flashcards/${id}`);
    return response.data;
  },

  async createFlashcard(data: CreateFlashcardDto): Promise<Flashcard> {
    const response = await apiClient.post<Flashcard>("/flashcards", data);
    return response.data;
  },

  async updateFlashcard(
    id: string,
    data: UpdateFlashcardDto
  ): Promise<Flashcard> {
    const response = await apiClient.patch<Flashcard>(
      `/flashcards/${id}`,
      data
    );
    return response.data;
  },

  async deleteFlashcard(id: string): Promise<void> {
    await apiClient.delete(`/flashcards/${id}`);
  },
};
