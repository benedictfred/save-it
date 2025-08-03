import { API_URL } from "../utils/constants";
import { Transaction, TransferAmount } from "../utils/types";

export async function transferAmount(
  data: TransferAmount
): Promise<{ status: "success" | "fail" | "error"; message: string }> {
  const response = await fetch(`${API_URL}/transaction/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Transfer Failed");
  }

  const responseData = await response.json();
  return responseData;
}

export async function getTransactionHistory(): Promise<Transaction[] | []> {
  const res = await fetch(`${API_URL}/transaction/history`, {
    credentials: "include",
  });
  const { data } = await res.json();
  return data;
}
