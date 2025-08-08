import { useQuery } from "@tanstack/react-query";
import { getRecipientName } from "../services/userService";

export const useRecipientName = (accountNumber: string, enabled = true) => {
  return useQuery({
    queryKey: ["recipient", accountNumber],
    queryFn: () => getRecipientName(accountNumber),
    enabled: !!accountNumber && enabled,
    retry: false,
    staleTime: 0,
  });
};
