import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login successful");
      navigate("/home", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });
}
