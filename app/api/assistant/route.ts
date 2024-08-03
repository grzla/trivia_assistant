import { NextRequest, NextResponse } from 'next/server';
import { createThreadIfNeeded, createMessage, runAssistant, getResponseMessages, extractTriviaResponse } from '@/lib/assistantHandler';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const input: { threadId: string | null; message: string } = await req.json();
    console.log('Input:', input);
    // Create a thread if needed
    const threadId = await createThreadIfNeeded(input.threadId);
    console.log('Thread ID:', threadId);
    // Add a message to the thread with the prompt for generating trivia questions
    const createdMessage = await createMessage(threadId, input.message);
    console.log('Created message:', createdMessage);

    // Run the assistant on the thread and wait for completion
    await runAssistant(threadId);

    // Get the response messages
    const responseMessages = await getResponseMessages(threadId, createdMessage.id);
    console.log('Response messages:', responseMessages);
    // Extract the trivia question from the response
    const triviaResponse = extractTriviaResponse(responseMessages);
    console.log('Trivia response:', triviaResponse);
    
    return new NextResponse(JSON.stringify(triviaResponse), {
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
