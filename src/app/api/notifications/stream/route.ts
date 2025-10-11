import { NextRequest } from "next/server";
import { addClient, removeClient, SSEData } from "@/lib/sse";

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (data: SSEData) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      // Envoi d’un message de bienvenue au format SSE
      send({ type: "refresh" }); // ou "info" si tu ajoutes ce type à SSEData

      const client = addClient(send);

      req.signal.addEventListener("abort", () => {
        removeClient(client);
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
