import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAbly } from "./useAbly";
import { Message } from "ably";
import Ably from "ably";

export function useTransactionStream() {
  const queryClient = useQueryClient();
  const { ably, isConnected, userId } = useAbly();
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);

  useEffect(() => {
    if (!ably || !isConnected || !userId) return;

    // Get channel
    channelRef.current = ably.channels.get(`user-${userId}`);

    // Subscribe to messages
    const messageHandler = (msg: Message) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("Got event:", msg.data);
    };

    channelRef.current.subscribe("message", messageHandler);

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe("message", messageHandler);
      }
    };
  }, [ably, isConnected, userId, queryClient]);
}
