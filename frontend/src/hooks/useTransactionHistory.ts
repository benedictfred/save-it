import { useQuery } from "@tanstack/react-query";
import { getTransactionHistory } from "../services/transactionService";

export const useTransactionHistory = () => {
  return useQuery({
    queryKey: ["transaction-history"],
    queryFn: getTransactionHistory,
  });
};
