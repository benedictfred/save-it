import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../utils/types";

type AuthContextType = {
  user: Partial<User> | null;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_BASE_URL;

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/users/dashboard`, {
        credentials: "include",
      });
      const responseBody = await res.json();
      if (!res.ok) {
        throw new Error(responseBody.message || "Authentication check failed");
      }
      setUser(responseBody.data);
    } catch (err) {
      console.error("Auth check failed", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={{ user, isLoading, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
