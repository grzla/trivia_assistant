import { log, logging } from "@/lib/logging";
import fixJson from "@/lib/fixJson";
import { NextRequest, NextResponse } from 'next/server';
import { createThreadIfNeeded, createMessage, runAssistant, getResponseMessages, extractTriviaResponse } from '@/lib/assistantHandler';
import { AssistantResponse } from 'ai';


export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const input: { threadId: string | null; message: string } = await req.json();
    log(`Input: ${input}`);

    // Create a thread if needed
    const threadId = await createThreadIfNeeded(input.threadId);
    // log(`Thread ID:  ${threadId}`);

    // Add a message to the thread with the prompt for generating trivia questions
    const createdMessage = await createMessage(threadId, input.message);
    // log(`Created message: ${createdMessage}`);

    // Run the assistant on the thread and wait for completion
    await runAssistant(threadId);

    // Get the response messages
    const responseMessages = await getResponseMessages(threadId, createdMessage.id);
    // log(`Response messages: ${responseMessages}`);

    // Extract the trivia question from the response
    let triviaResponse = extractTriviaResponse(responseMessages);

    return new NextResponse(((triviaResponse)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';

    return new NextResponse(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
