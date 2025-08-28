import { API_URL } from "../utils/constants";
import { Transaction, TransferAmount } from "../utils/types";

export async function transferAmount(
  data: TransferAmount
): Promise<{ status: "success" | "fail" | "error"; message: string }> {
  const response = await fetch(`${API_URL}/transactions/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData?.message || "Transfer Failed");
  }

  return responseData;
}

export async function getTransactionHistory(): Promise<Transaction[] | []> {
  const res = await fetch(`${API_URL}/transactions/history`, {
    credentials: "include",
  });
  const { data } = await res.json();

  if (!res.ok) {
    throw new Error("Could not fetch transactions");
  }

  return data;
}
