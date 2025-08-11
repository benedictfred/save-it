import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../utils/constants";

export function useTransactionStream() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let eventSource: EventSource | null = null;

    eventSource = new EventSource(`${API_URL}/transactions/stream`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "transaction" || data.event === "notification") {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    };

    eventSource.onerror = () => {
      console.warn("Transaction stream closed due to error, reconnecting...");
    };

    return () => {
      eventSource?.close();
    };
  }, [queryClient]);
}
