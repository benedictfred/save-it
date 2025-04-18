import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuthStatus } = useAuth();
  const isAuthenticated = checkAuthStatus();
  return isAuthenticated ? children : <Navigate to="/sign-in" />;
}
