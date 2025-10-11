// src/lib/sse.ts

// ✅ Types des notifications
export type Notification = {
  id: number;
  message: string;
  createdAt: string;
  [key: string]: unknown; // si d'autres propriétés peuvent exister
};

export type SSEData =
  | { type: "create"; notification: Notification }
  | { type: "delete"; itemId: number; vehicleId: number; notifType: string }
  | { type: "refresh"; vehicleId?: number };

// Client SSE
type SSEClient = { send: (data: SSEData) => void };

let clients: SSEClient[] = [];

export function addClient(send: (data: SSEData) => void) {
  const client: SSEClient = { send };
  clients.push(client);
  return client;
}

export function removeClient(client: SSEClient) {
  clients = clients.filter((c) => c !== client);
}

export function broadcastNotification(notification: Notification) {
  const data: SSEData = { type: "create", notification };
  clients.forEach((client) => client.send(data));
}

export function broadcastRemoveNotification(itemId: number, vehicleId: number, type: string) {
  const data: SSEData = { type: "delete", itemId, vehicleId, notifType: type };
  clients.forEach((client) => client.send(data));
}

export function broadcastRefresh(vehicleId?: number) {
  const data: SSEData = { type: "refresh", vehicleId };
  clients.forEach((client) => client.send(data));
}
