import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../services/userService";

export const useFetchUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 0,
    refetchInterval: 10 * 1000,
    refetchOnWindowFocus: true,
    retry: false,
  });
};
