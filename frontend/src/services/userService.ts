import { API_URL } from "../utils/constants";
import { User } from "../utils/types";

export const fetchUser = async (): Promise<Partial<User>> => {
  const response = await fetch(`${API_URL}/users/dashboard`, {
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message);
  }

  return responseData.data;
};
