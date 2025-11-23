export interface Flashcard {
  id: string;
  deck_id: string;
  front_content: string;
  back_content: string;
  hint?: string;
  mnemonic?: string;
  is_suspended: boolean;
  next_review_date?: string;
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
