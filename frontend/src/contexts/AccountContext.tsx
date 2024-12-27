import { createContext, useContext, useEffect, useState } from "react";
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
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function getUser() {
    const localUser = JSON.parse(localStorage.getItem("user") as string);
    const id = localUser?.id;
    if (!id) return;

    fetch(`http://localhost:8000/users/${id}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }
  useEffect(() => {
    getUser();
  }, []);

  async function login(
    data: LoginFormData
  ): Promise<{ status: "success" | "error"; message: string; user?: User }> {
    try {
      const response = await fetch("http://localhost:8000/login", {
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
    }
  }

  async function registerUser(
    data: SignUpFormData
  ): Promise<{ status: "success" | "error"; message: string }> {
    try {
      const response = await fetch("http://localhost:8000/register", {
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
