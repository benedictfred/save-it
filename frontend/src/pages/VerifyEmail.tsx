import { useNavigate, useParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        setIsLoading(true);
        await verifyEmail(token as string);
        toast.success("Email verified successfully!");
        navigate("/verify-phone");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
        navigate("/resend-email");
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  if (isLoading) return <Loader />;

  return null;
}
