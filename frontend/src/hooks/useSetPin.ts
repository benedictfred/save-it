import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setPin } from "../services/authService";
import { toast } from "react-toastify";

export const useSetPin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setPin,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });
};
