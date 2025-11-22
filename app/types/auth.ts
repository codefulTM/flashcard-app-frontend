export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username?: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
}
