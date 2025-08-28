import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyPhone } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useVerifyOtp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPhone,
    onSuccess: (data) => {
      toast.success(data.message || "Phone number verified successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/home", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to verify phone number");
    },
  });
}
