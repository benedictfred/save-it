import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(data.message || "Registration Successful");
      navigate("/resend-email", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed");
    },
  });
}
