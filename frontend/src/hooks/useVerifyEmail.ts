import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useVerifyEmail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success("Email verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/verify-phone", { replace: true });
    },
    onError: (error) => {
      toast.error(error?.message || "Email verification failed");
      navigate("/resend-email", { replace: true });
    },
  });
}
