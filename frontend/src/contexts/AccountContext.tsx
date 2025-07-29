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
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { useLocation, useNavigate } from "react-router-dom";

type AccountContextType = {
  setUser: (user: Partial<User> | null) => void;
  registerUser: (
    data: SignUpFormData
  ) => Promise<{ status: "success" | "error"; message: string }>;
  login: (data: LoginFormData) => Promise<{
    status: "success" | "fail" | "error";
    message?: string;
    user: Partial<User> | null;
  }>;
  user: Partial<User> | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUser: () => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  // const { pathname } = useLocation();

  // const API_URL = "http://localhost:8000";
  const API_URL = import.meta.env.VITE_BASE_URL;

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/users/dashboard`, {
        credentials: "include",
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message);
        navigate("/sign-in", { replace: true });
        return;
      }

      const user = responseData.data ?? null;
      setUser(user);
    } catch (err) {
      const customError = err as CustomError;
      const message = customError.message ?? "Something went wrong";

      toast.error(message);
      navigate("/sign-in", { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUser();
      checkAuthStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [checkAuthStatus, fetchUser]);

  async function login(data: LoginFormData): Promise<{
    status: "success" | "fail" | "error";
    message?: string;
    user: Partial<User> | null;
  }> {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      return {
        status: responseData.status,
        user: responseData.user ?? null,
      };
    } catch (error) {
      const customError = error as CustomError;
      console.log(customError.message);
      return { status: "fail", message: customError.message, user: null };
    } finally {
      setIsLoading(false);
    }
  }

  async function registerUser(
    data: SignUpFormData
  ): Promise<{ status: "success" | "error"; message: string }> {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/register`, {
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
        fetchUser,
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
