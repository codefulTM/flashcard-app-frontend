export interface Deck {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  cards_per_session: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDeckDto {
  name: string;
  description?: string;
  is_public?: boolean;
  cards_per_session?: number;
}

export interface UpdateDeckDto extends Partial<CreateDeckDto> {}
