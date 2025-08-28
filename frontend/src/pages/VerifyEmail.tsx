import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";

export default function VerifyEmail() {
  const { token } = useParams();
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.emailVerified) {
      navigate("/verify-phone", { replace: true });
      return;
    }
    const verify = async () => {
      try {
        setIsLoading(true);
        await verifyEmail(token as string);
        await fetchUser();
        toast.success("Email verified successfully!");
        return navigate("/verify-phone");
      } catch (error) {
        toast.error((error as Error)?.message || "Email verification failed");
        return navigate("/resend-email");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token, navigate, user, fetchUser]);

  if (isLoading) return <Loader />;

  return null;
}
