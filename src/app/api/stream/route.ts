import { redis } from "@/lib/redis";
import { db } from "@/server/db";
import type { Message } from "@/types/redisData";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { streamAIResponse } from "@/lib/openai";

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

  const redisMessages = (await redis.get(`whiteboard-messages-${bookingId}`)) as Message[] || [];
  const messages = [...redisMessages, { type: 'sent' as const, message: userMessage, thinking: false, id: crypto.randomUUID() }];

  return new ReadableStream({
    async start(controller: ReadableStreamController<Uint8Array>) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      sendEvent({ type: 'thinking', message: 'Thinking...' });

      try {
        // Get the streaming response from OpenAI
        const stream = await streamAIResponse(messages);

        let currentResponse = '';

        // Process the stream
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            currentResponse += content;
            sendEvent({ type: 'chunk', message: currentResponse });
          }
        }

        // Store the AI response in Redis
        if (currentResponse) {
          const aiResponseMessage = {
            type: 'received' as const,
            message: currentResponse,
            thinking: false,
            id: crypto.randomUUID()
          };
          await redis.set(`whiteboard-messages-${bookingId}`, [...messages, aiResponseMessage]);

          sendEvent({ type: 'done', message: currentResponse });
        }
      } catch (error) {
        console.error("Error streaming response:", error);
        sendEvent({ type: 'error', message: 'Failed to generate response' });
      } finally {
        controller.close();
      }
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
