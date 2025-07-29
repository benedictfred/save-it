import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import Loader from "./Loader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/sign-in", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) return <Loader />;

  return <>{children}</>;
}
