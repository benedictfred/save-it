import { useMutation } from "@tanstack/react-query";
import { verifyPhone } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useVerifyOtp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyPhone,
    onSuccess: (data) => {
      toast.success(data.message || "Phone number verified successfully");
      navigate("/home", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to verify phone number");
    },
  });
}
