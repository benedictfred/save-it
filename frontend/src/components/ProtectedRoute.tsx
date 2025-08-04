import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || error)) {
      navigate("/sign-in", { replace: true });
    }
  }, [isLoading, user, error, navigate]);

  if (isLoading) return <Loader />;

  if (!user) return null;

  return <>{children}</>;
}
