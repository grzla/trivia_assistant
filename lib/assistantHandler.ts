import { Message } from 'ai';
import openai from './openaiClient';

type Run = {
  id: string;
  status: 'queued' | 'in_progress' | 'requires_action' | 'cancelling' | 'cancelled' | 'failed' | 'completed' | 'expired';
};

export async function createThreadIfNeeded(threadId: string | null): Promise<string> {
  if (threadId) return threadId;
  const thread = await openai.beta.threads.create({});
  return thread.id;
}

export async function createMessage(threadId: string, content: string): Promise<Message> {
  const createdMessage = await openai.beta.threads.messages.create(
    threadId,
    { role: 'user', content }
  );
  return createdMessage;
}

export async function runAssistant(threadId: string): Promise<Run> {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID ?? (() => { throw new Error('ASSISTANT_ID is not set'); })(),
  }) as Run;

  return waitForRunCompletion(threadId, run);
}

async function waitForRunCompletion(threadId: string, run: Run): Promise<Run> {
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
  console.log('Run completed:', run);
  return run;
}

export async function getResponseMessages(threadId: string, afterMessageId: string) {
  const response = await openai.beta.threads.messages.list(threadId, {
    after: afterMessageId,
    order: 'asc',
  });
  console.log('Response messages:', response.data);
  return response.data;
}

export function extractTriviaResponse(responseMessages: any[]): string {
  const triviaResponse = responseMessages.find(
    (message) => message.role === 'assistant'
)?.content;
// )?.content?.find((content) => content.type === 'text');
    
  if (!triviaResponse) {
    throw new Error('No trivia question found in the response');
  }

  return triviaResponse;
}
