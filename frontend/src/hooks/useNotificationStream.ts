import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../utils/constants";

export function useNotificationStream() {
  const queryClient = useQueryClient();
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      eventSource = new EventSource(`${API_URL}/notifications/stream`, {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === "notification") {
          queryClient.invalidateQueries({ queryKey: ["user"] });
        }
      };

      eventSource.onerror = () => {
        console.warn(
          "Notification stream closed due to error, reconnecting..."
        );
        eventSource?.close();

        reconnectTimeout.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [queryClient]);
}
