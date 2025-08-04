import { createContext, useContext, useEffect } from "react";
import { User } from "../utils/types";
import { useFetchUser } from "../hooks/useFetchUser";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type AuthContextType = {
  user: Partial<User> | undefined;
  isLoading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useFetchUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const authPages = ["/sign-in", "/sign-up"];
    if (error && !authPages.includes(pathname)) {
      toast.error((error as Error).message);
      navigate("/sign-in", { replace: true });
    } else if (user && authPages.includes(pathname)) {
      navigate("/home", { replace: true });
    }
  }, [error, navigate, pathname, user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
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
