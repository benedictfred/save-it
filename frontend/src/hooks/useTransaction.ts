import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferAmount } from "../services/transactionService";
import { toast } from "react-toastify";

export const useTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferAmount,
    onSuccess: (data) => {
      toast.success(data.message || "Transfer successful");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
      toast.error(
        err.message || "An unexpected error occurred during the transfer"
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
