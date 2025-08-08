import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../services/authService";
import { toast } from "react-toastify";

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });
}
