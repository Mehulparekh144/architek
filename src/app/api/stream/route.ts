import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const headers = {
  'Content-Type': 'text/event-stream', // MIME type for Server-Sent Events
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
};

const encoder = new TextEncoder();

// Helper function for streaming logic
function generateStreamResponse(userMessage: string | null): ReadableStream<Uint8Array> {
  if (!userMessage) {
    return new ReadableStream({
      start(controller) {
        const errorData = { type: 'error', message: 'Missing userMessage' };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
        controller.close();
      }
    });
  }

  return new ReadableStream({
    async start(controller: ReadableStreamController<Uint8Array>) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      sendEvent({ type: 'thinking', message: 'Thinking...' });

      // TODO : Call the LLM
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = `Hello, how can I help you today? ${userMessage}`;
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
    const { userMessage } = await req.json();
    const stream = generateStreamResponse(userMessage);
    return new Response(stream, { headers });
  } catch (error) {
    console.error("Error processing POST request:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: "Failed to process request", details: message }, { status: 500 });
  }
}

export function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userMessage = url.searchParams.get("userMessage"); 

  const stream = generateStreamResponse(userMessage);
  return new Response(stream, { headers });
}