import apiClient from "../lib/api-client";
import { LoginDto, RegisterDto } from "@/app/types/auth"; // We will create this type file next

export interface AuthResponse {
  accessToken: string;
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<any> {
    // Adjust return type as needed
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  logout() {
    localStorage.removeItem("accessToken");
  },
};
