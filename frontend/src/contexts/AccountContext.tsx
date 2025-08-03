import { createContext, useContext, useEffect } from "react";
// import { SignUpFormData } from "../components/SignUpForm";
import { User } from "../utils/types";
// import { LoginFormData } from "../components/LoginForm";
// import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchUser } from "../hooks/useFetchUser";
// import { useLocation, useNavigate } from "react-router-dom";

type AccountContextType = {
  user: Partial<User> | null;
  isLoading: boolean;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  // const [setUser] = useState<Partial<User> | null>(null);
  const { data: user, error, isLoading } = useFetchUser();
  // const setIsLoading = useState(false);
  // const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const authPages = ["/sign-in", "/sign-up"];
    if (error && !authPages.includes(pathname)) {
      toast.error((error as Error).message);
      navigate("/sign-in", { replace: true });
    }
  }, [error, navigate, pathname]);

  // async function login(data: LoginFormData): Promise<{
  //   status: "success" | "fail" | "error";
  //   message?: string;
  //   user: Partial<User> | null;
  // }> {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetch(`${API_URL}/auth/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message);
  //     }

  //     const responseData = await response.json();
  //     return {
  //       status: responseData.status,
  //       user: responseData.user ?? null,
  //     };
  //   } catch (error) {
  //     const customError = error as CustomError;
  //     console.log(customError.message);
  //     return { status: "fail", message: customError.message, user: null };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // async function registerUser(
  //   data: SignUpFormData
  // ): Promise<{ status: "success" | "error"; message: string }> {
  //   try {
  //     // setIsLoading(true);
  //     const response = await fetch(`${API_URL}/auth/register`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message);
  //     }

  //     const responseData = await response.json();
  //     return { status: "success", message: responseData.message };
  //   } catch (error) {
  //     const customError = error as CustomError;
  //     return { status: "error", message: customError.message };
  //   } finally {
  //     // setIsLoading(false);
  //   }
  // }

  return (
    <AccountContext.Provider
      value={{
        user,
        isLoading,
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
