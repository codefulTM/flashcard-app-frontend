export interface Deck {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  cards_per_session: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  next_review_at?: string;
  is_custom_study?: boolean;
  source_deck_id?: string;
}

export interface CreateDeckDto {
  name: string;
  description?: string;
  is_public?: boolean;
  cards_per_session?: number;
}

export interface UpdateDeckDto extends Partial<CreateDeckDto> {}
