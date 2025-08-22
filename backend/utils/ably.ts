import Ably from "ably";

export const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });

export async function sendEvent(userId: string, data: unknown) {
  const channel = ably.channels.get(`user-${userId}`);
  await channel.publish("message", data);
}
