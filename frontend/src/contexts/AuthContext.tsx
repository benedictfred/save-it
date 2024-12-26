import { createContext, useContext } from "react";

type AuthContextType = {
  checkAuthStatus: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuthStatus = () => {
    const expiry = localStorage.getItem("expiry");
    const currentTime = new Date().getTime();

    if (!expiry || currentTime > parseInt(expiry)) {
      localStorage.removeItem("authenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("expiry");
      return false;
    }

    return localStorage.getItem("authenticated") === "true";
  };

  return (
    <AuthContext.Provider value={{ checkAuthStatus }}>
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
