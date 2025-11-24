export interface Flashcard {
  id: string;
  deck_id: string;
  front_content: string;
  back_content: string;
  hint?: string;
  mnemonic?: string;
  is_suspended: boolean;

  // Spaced Repetition fields
  next_review_at?: string;
  interval?: number;
  ease_factor: number;
  repetitions: number;
  state: "new" | "learning" | "review" | "relearning";

  created_at: string;
  updated_at: string;
}

export interface CreateFlashcardDto {
  deck_id: string;
  front_content: string;
  back_content: string;
  hint?: string;
  mnemonic?: string;
  is_suspended?: boolean;
}

export interface UpdateFlashcardDto extends Partial<CreateFlashcardDto> {}

export interface ReviewFlashcardDto {
  rating: number; // 1=Again, 2=Hard, 3=Good, 4=Easy
  timeTakenMs?: number;
}
