import { Request, Response } from "express";

type Client = {
  userId: string;
  res: Response;
};

const clients: Client[] = [];

export function addClient(userId: string, req: Request, res: Response) {
  // Set headers for SSE
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  // Add to list
  clients.push({ userId, res });

  console.log(clients.length);

  // Send a ping every 30s to keep the connection alive
  const keepAlive = setInterval(() => {
    res.write(":\n\n"); // SSE comment format to keep alive
  }, 15000);

  // Remove client on disconnect
  req.on("close", () => {
    clearInterval(keepAlive);
    removeClient(userId, res);
  });
}

export function removeClient(userId: string, res: Response) {
  const index = clients.findIndex((c) => c.userId === userId && c.res === res);
  if (index !== -1) {
    clients.splice(index, 1);
  }
}

export function sendEvent(userId: string, data: any) {
  const userClients = clients.filter((c) => c.userId === userId);
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  userClients.forEach(({ res }) => res.write(payload));
}

export function broadcast(data: any) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(({ res }) => res.write(payload));
}
