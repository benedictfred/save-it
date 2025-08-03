import { createContext, useCallback, useContext } from "react";
import { User } from "../utils/types";
import { useFetchUser } from "../hooks/useFetchUser";

type AuthContextType = {
  user: Partial<User> | undefined;
  isLoading: boolean;
  isError: boolean;
  checkAuthStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, refetch, isError } = useFetchUser();

  const checkAuthStatus = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider value={{ user, isLoading, checkAuthStatus, isError }}>
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
