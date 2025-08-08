import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { authPages } from "../utils/constants";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || error)) {
      toast.error(error?.message || "Please login to get access");
      navigate("/sign-in", { replace: true });
    } else if (user && authPages.find((el) => pathname.startsWith(el))) {
      navigate("/home", { replace: true });
    }
  }, [error, navigate, user, isLoading, pathname]);

  if (isLoading) return <Loader />;

  if (!user) return null;

  return <>{children}</>;
}
