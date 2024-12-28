import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SignUpFormData } from "../components/SignUpForm";
import { CustomError, User } from "../utils/types";
import { LoginFormData } from "../components/LoginForm";

type AccountContextType = {
  setUser: (user: User) => void;
  registerUser: (
    data: SignUpFormData
  ) => Promise<{ status: "success" | "error"; message: string }>;
  login: (
    data: LoginFormData
  ) => Promise<{ status: "success" | "error"; message: string; user?: User }>;
  user: User | null;
  getUser: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const API_URL = "http://localhost:8000";
  const API_URL = import.meta.env.VITE_BASE_URL;

  const getUser = useCallback(() => {
    const localUser = JSON.parse(localStorage.getItem("user") as string);
    const id = localUser?.id;
    if (!id) return;

    fetch(`${API_URL}/users/${id}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [API_URL]);

  useEffect(() => {
    getUser();

    const interval = setInterval(() => {
      getUser();
    }, 10000);

    return () => clearInterval(interval);
  }, [getUser]);

  async function login(
    data: LoginFormData
  ): Promise<{ status: "success" | "error"; message: string; user?: User }> {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      console.log(responseData);
      return {
        status: "success",
        message: responseData.message,
        user: responseData.user,
      };
    } catch (error) {
      const customError = error as CustomError;
      return { status: "error", message: customError.message };
    } finally {
      setIsLoading(false);
    }
  }

  async function registerUser(
    data: SignUpFormData
  ): Promise<{ status: "success" | "error"; message: string }> {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      return { status: "success", message: responseData.message };
    } catch (error) {
      const customError = error as CustomError;
      return { status: "error", message: customError.message };
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AccountContext.Provider
      value={{
        registerUser,
        login,
        setUser,
        user,
        getUser,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
}

export { AccountProvider, useAccount };
