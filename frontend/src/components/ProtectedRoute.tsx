import { useEffect, useState } from "react";
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
  const { user, isLoading, isRefetching, error } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoading || isRefetching) return;

    // 1. Not logged in
    if (!user || error) {
      toast.error(error?.message || "Please login to get access");
      navigate("/sign-in", { replace: true });
      return;
    }

    // 2. Logged in but on auth pages
    if (authPages.some((el) => pathname.startsWith(el))) {
      navigate("/home", { replace: true });
      return;
    }

    // 3. Email must be verified first
    if (user.status === "pending" && pathname !== "/resend-email") {
      navigate("/resend-email", { replace: true });
      return;
    }

    // 4. Only check phone if email is verified
    // if (
    //   user.emailVerified &&
    //   !user.phoneVerified &&
    //   pathname !== "/verify-phone"
    // ) {
    //   navigate("/verify-phone", { replace: true });
    //   return;
    // }

    setIsChecking(false);
  }, [error, navigate, user, isLoading, isRefetching, pathname]);

  if (isLoading || isChecking) return <Loader />;

  return <>{children}</>;
}
