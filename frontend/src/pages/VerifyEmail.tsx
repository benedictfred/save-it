import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export default function VerifyEmail() {
  const { token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    if (user?.status === "active") {
      navigate("/home", { replace: true });
      return;
    }

    if (token) {
      verifyEmail(token);
      hasRun.current = true;
    }
  }, [token, navigate, user, verifyEmail]);

  if (isPending) return <Loader />;

  return null;
}
