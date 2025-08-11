// sse.ts
import type { Request, Response } from "express";

type Client = { userId: string; res: Response };
const clients: Client[] = [];

export function addClient(userId: string, req: Request, res: Response) {
  const origin = req.headers.origin;

  // CORS for SSE (exact origin + credentials)
  if (
    origin === "https://save-it-rho.vercel.app" ||
    origin?.startsWith("http://localhost:")
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders?.();

  res.write("retry: 3000\n\n");

  res.write(":\n\n");

  clients.push({ userId, res });

  const keepAlive = setInterval(() => {
    res.write(":\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(keepAlive);
    const index = clients.findIndex(
      (c) => c.userId === userId && c.res === res
    );
    if (index !== -1) clients.splice(index, 1);
  });
}

export function sendEvent(userId: string, data: unknown, event?: string) {
  const payload =
    (event ? `event: ${event}\n` : "") + `data: ${JSON.stringify(data)}\n\n`;
  clients
    .filter((c) => c.userId === userId)
    .forEach(({ res }) => res.write(payload));
}

export function broadcast(data: unknown, event?: string) {
  const payload =
    (event ? `event: ${event}\n` : "") + `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(({ res }) => res.write(payload));
}
