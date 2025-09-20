import { NextRequest } from "next/server";

type SSEClient = { send: (data: any) => void };
let clients: SSEClient[] = [];

export async function GET(req: NextRequest) {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const send = (data: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

            send({ type: "info", message: "✅ Connecté au flux SSE" });

            const client = { send };
            clients.push(client);

            req.signal.addEventListener("abort", () => {
                clients = clients.filter(c => c !== client);
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}

// 🔹 Broadcast helpers
export function broadcastNotification(notification: any) {
    clients.forEach(client => client.send({ type: "create", notification }));
}

export function broadcastRemoveNotification(itemId: number, vehicleId: number, type: string) {
    clients.forEach(client => client.send({ type: "delete", itemId, vehicleId, notifType: type }));
}

export function broadcastRefresh(vehicleId?: number) {
    clients.forEach(client => client.send({ type: "refresh", vehicleId }));
}