import { createContext, useContext } from "react";
import { User } from "../utils/types";
import { useFetchUser } from "../hooks/useFetchUser";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

type AuthContextType = {
  user: Partial<User> | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  error: Error | null;
  fetchUser: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Partial<User>, Error>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    data: user,
    isLoading,
    isRefetching,
    error,
    refetch: fetchUser,
  } = useFetchUser();

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isRefetching, error, fetchUser }}
    >
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
