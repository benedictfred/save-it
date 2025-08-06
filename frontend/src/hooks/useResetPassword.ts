import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { ResetPasswordData } from "../components/ResetPasswordForm";
import { toast } from "react-toastify";

export function useResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data, token!),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/sign-in", { replace: true });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });
}
