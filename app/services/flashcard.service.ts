import apiClient from "../lib/api-client";
import {
  CreateFlashcardDto,
  Flashcard,
  UpdateFlashcardDto,
  ReviewFlashcardDto,
} from "../types/flashcard";

export const flashcardService = {
  async getFlashcards(
    deckId: string,
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Flashcard[]; total: number }> {
    const response = await apiClient.get<{ data: Flashcard[]; total: number }>(
      "/flashcards",
      {
        params: { deckId, page, limit, search },
      }
    );
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

  async generateFlashcard(
    deckId: string,
    frontContent: string,
    prompt?: string
  ): Promise<Flashcard> {
    const response = await apiClient.post<Flashcard>("/flashcards/generate", {
      deck_id: deckId,
      front_content: frontContent,
      prompt,
    });
    return response.data;
  },

  async regenerateFlashcard(id: string, prompt?: string): Promise<Flashcard> {
    const response = await apiClient.post<Flashcard>(`/flashcards/${id}/regenerate`, { prompt });
    return response.data;
  },

  async reviewFlashcard(
    id: string,
    data: ReviewFlashcardDto
  ): Promise<Flashcard> {
    const response = await apiClient.post<Flashcard>(
      `/flashcards/${id}/review`,
      data
    );
    return response.data;
  },

  async undoReview(id: string): Promise<Flashcard> {
    const response = await apiClient.post<Flashcard>(`/flashcards/${id}/undo-review`);
    return response.data;
  },

  async getDueFlashcards(
    deckId: string,
    limit?: number
  ): Promise<Flashcard[]> {
    const response = await apiClient.get<Flashcard[]>(
      `/flashcards/deck/${deckId}/due`,
      {
        params: limit ? { limit } : {},
      }
    );
    return response.data;
  },
};
