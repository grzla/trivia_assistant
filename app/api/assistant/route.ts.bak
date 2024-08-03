import { AssistantResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const homeTemperatures = {
  bedroom: 20,
  'home office': 21,
  'living room': 21,
  kitchen: 22,
  bathroom: 23,
};

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const input: {
      threadId: string | null;
      message: string;
    } = await req.json();

    // Create a thread if needed
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: input.message,
      },
      // { signal: req.signal },
    );

    // Run the assistant on the thread
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id:
        process.env.OPENAI_ASSISTANT_ID ??
        (() => {
          throw new Error('ASSISTANT_ID is not set');
        })(),
    });

    type Run = {
      id: string;
      // type: "string union" or "string literal" 
      status: 'queued' | 'in_progress' | 'requires_action' | 'cancelling' | 'cancelled' | 'failed' | 'completed' | 'expired';
    };

    // Poll for run completion
    async function waitForRunCompletion(run: Run): Promise<Run> {
      while (run.status === 'queued' || run.status === 'in_progress') {
        await new Promise((resolve) => setTimeout(resolve, 500));
        run = await openai.beta.threads.runs.retrieve(threadId, run.id) as Run;
      }

      if (
        run.status === 'cancelled' ||
        run.status === 'cancelling' ||
        run.status === 'failed' ||
        run.status === 'expired'
      ) {
        throw new Error(`Run status: ${run.status}`);
      }

      return run;
    }

    await waitForRunCompletion(run as Run);

    // Get the response messages
    const responseMessages = (
      await openai.beta.threads.messages.list(threadId, {
        after: createdMessage.id,
        order: 'asc',
      })
    ).data;
    console.log(responseMessages);

    // Extract the trivia question from the response
    const triviaResponse = responseMessages.find(
      (message) => message.role === 'assistant'
    )?.content;

    if (!triviaResponse) {
      throw new Error('No trivia question found in the response');
    }

    // console.log(triviaResponse);
    return new NextResponse(JSON.stringify(triviaResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';

    return new NextResponse(
      JSON.stringify({ errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
