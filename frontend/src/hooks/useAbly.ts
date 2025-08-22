import { useEffect, useRef, useState } from "react";
import Ably from "ably";
import type { ErrorInfo } from "ably";
import { API_URL } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";

export function useAbly() {
  const { user } = useAuth();
  const ablyRef = useRef<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    if (ablyRef.current) return;

    ablyRef.current = new Ably.Realtime({
      authUrl: `${API_URL}/transactions/stream`,
      authMethod: "GET",
      authHeaders: {
        "Content-Type": "application/json",
      },
      authCallback: async (tokenParams, callback) => {
        try {
          const response = await fetch(`${API_URL}/transactions/stream`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(`Auth failed: ${response.status}`);
          }

          const tokenRequest = await response.json();
          callback(null, tokenRequest);
        } catch (err) {
          callback(err as ErrorInfo, null);
        }
      },
    });

    ablyRef.current.connection.on("connected", () => {
      setIsConnected(true);
      console.log("Ably connected");
    });

    ablyRef.current.connection.on("disconnected", () => {
      setIsConnected(false);
      console.log("Ably disconnected");
    });

    return () => {
      if (ablyRef.current) {
        ablyRef.current.close();
        ablyRef.current = null;
      }
      setIsConnected(false);
    };
  }, [user?.id]);

  return { ably: ablyRef.current, isConnected, userId: user?.id };
}
