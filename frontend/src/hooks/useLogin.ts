import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFetchUser } from "./useFetchUser";

export function useLogin() {
  const { refetch: fetchUser } = useFetchUser();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await fetchUser();
      toast.success("Login successful");
      navigate("/home", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });
}
