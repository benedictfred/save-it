// hooks/useTransactionStream.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../utils/constants";

export function useTransactionStream() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/transaction/stream`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "transaction") {
        console.log(data);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    };

    eventSource.onerror = () => {
      console.warn("Transaction stream closed due to error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}
