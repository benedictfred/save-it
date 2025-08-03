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

export async function getRecipientName(accountNumber: string): Promise<string> {
  const response = await fetch(`${API_URL}/users/${accountNumber}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("User not found");
  }

  const { data } = await response.json();
  return data.name;
}
