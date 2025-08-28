import { API_URL } from "../utils/constants";

export async function markAllAsRead() {
  const response = await fetch(`${API_URL}/notifications/mark-all-as-read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not mark notifications as read");
  }

  return response.json();
}
