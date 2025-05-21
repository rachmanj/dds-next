"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUser, login as apiLogin, logout as apiLogout } from "./api";

type User = {
  id: number;
  name: string;
  email: string;
} | null;

// Extended type for login response
type LoginResponse = {
  ok: boolean;
  data?: any;
  error?: any;
  statusCode?: number;
  errorMessage?: string;
};

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on initial load
  useEffect(() => {
    console.log("AuthProvider: Initializing and checking auth status");
    checkAuth();
  }, []);

  // Function to verify authentication status
  const checkAuth = async () => {
    setLoading(true);
    try {
      console.log("Checking authentication status...");
      const userData = await getUser();

      if (userData) {
        console.log("User is authenticated:", userData.email);
        setUser(userData);
      } else {
        console.log("User is not authenticated");
        setUser(null);
      }
    } catch (error) {
      // This should rarely happen since getUser() handles 401 internally
      console.error("Unexpected error during authentication check:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      console.log(`Attempting to login user: ${email}`);
      const response = await apiLogin(email, password);

      if (response.ok) {
        console.log("Login successful, fetching user data");
        await checkAuth();
        return response;
      }
      console.log("Login failed", response);
      return response;
    } catch (error) {
      console.error("Login failed with exception:", error);
      return {
        ok: false,
        error,
        errorMessage:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("Logging out user");
      await apiLogout();
      setUser(null);
      console.log("Logout successful, user state cleared");
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear user anyway
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
