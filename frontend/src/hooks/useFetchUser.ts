import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../services/userService";
import { useLocation } from "react-router-dom";
import { authPages } from "../utils/constants";

export const useFetchUser = () => {
  const { pathname } = useLocation();
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 0,
    enabled: !authPages.find((el) => pathname.startsWith(el)),
    refetchOnWindowFocus: true,
    retry: false,
  });
};
