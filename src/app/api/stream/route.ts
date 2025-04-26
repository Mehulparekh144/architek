import { redis } from "@/lib/redis";
import { db } from "@/server/db";
import type { Message } from "@/types/redisData";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const headers = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
};

const encoder = new TextEncoder();

async function generateStreamResponse(userMessage: string | null, bookingId: string): Promise<ReadableStream<Uint8Array>> {
  const booking = await db.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!userMessage || !booking) {
    return new ReadableStream({
      start(controller) {
        const errorData = { type: 'error', message: 'Missing userMessage' };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
        controller.close();
      }
    });
  }

  const redisMessages = (await redis.get(`whiteboard-messages-${bookingId}`)) as Message[];
  const messages = [...redisMessages, { type: 'sent', message: userMessage, thinking: false, id: crypto.randomUUID() }];

  return new ReadableStream({
    async start(controller: ReadableStreamController<Uint8Array>) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      sendEvent({ type: 'thinking', message: 'Thinking...' });

      // TODO : Call the LLM
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = `Hello, how can I help you today with booking ${bookingId}? ${messages[messages.length - 1]?.message}`;
      let currentResponse = '';

      for (const char of response) {
        currentResponse += char;
        sendEvent({ type: 'chunk', message: currentResponse });
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      sendEvent({ type: 'done', message: currentResponse });

      controller.close();
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!req.body) {
      return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
    }
    const { userMessage, bookingId } = await req.json();
    const stream = await generateStreamResponse(userMessage, bookingId);
    return new Response(stream, { headers });
  } catch (error) {
    console.error("Error processing POST request:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: "Failed to process request", details: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userMessage = url.searchParams.get("userMessage");
  const bookingId = url.searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  const stream = await generateStreamResponse(userMessage, bookingId);
  return new Response(stream, { headers });
}