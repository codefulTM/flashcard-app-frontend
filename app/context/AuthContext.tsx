"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import { LoginDto, RegisterDto, User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginDto, returnUrl?: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    console.log("Checking auth, token:", token ? "Found" : "Not found");

    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid token format");
        }

        // Simple decode to get user info
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const payload = JSON.parse(jsonPayload);
        console.log("Decoded payload:", payload);

        // Check if token is expired
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          throw new Error("Token expired");
        }

        setUser({
          id: payload.sub, // Assuming 'sub' is id
          email: payload.email,
          username: payload.username,
        });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (data: LoginDto, returnUrl: string = "/") => {
    try {
      const response = await authService.login(data);
      localStorage.setItem("accessToken", response.accessToken);
      await checkAuth();
      router.push(returnUrl);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      await authService.register(data);
      router.push("/login");
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
