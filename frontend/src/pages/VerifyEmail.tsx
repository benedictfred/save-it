import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export default function VerifyEmail() {
  const { token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: verifyEmail, isPending } = useVerifyEmail();

  useEffect(() => {
    if (user?.emailVerified) {
      navigate("/verify-phone", { replace: true });
      return;
    }

    if (token) {
      verifyEmail(token);
    }
  }, [token, navigate, user, verifyEmail]);

  if (isPending) return <Loader />;

  return null;
}
