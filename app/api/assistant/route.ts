import { log, logging } from "@/lib/logging";
import fixJson from "@/lib/fixJson";
import { NextRequest, NextResponse } from 'next/server';
import { createThreadIfNeeded, createMessage, runAssistant, getResponseMessages, extractTriviaResponse } from '@/lib/assistantHandler';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const input: { threadId: string | null; message: string } = await req.json();
    // console.log('Input:', input);

    // Create a thread if needed
    const threadId = await createThreadIfNeeded(input.threadId);
    // console.log('Thread ID:', threadId);

    // Add a message to the thread with the prompt for generating trivia questions
    const createdMessage = await createMessage(threadId, input.message);
    // console.log('Created message:', createdMessage);

    // Run the assistant on the thread and wait for completion
    await runAssistant(threadId);

    // Get the response messages
    const responseMessages = await getResponseMessages(threadId, createdMessage.id);
    // console.log('Response messages:', responseMessages);

    // Extract the trivia question from the response
    // const triviaResponse = fixJson(extractTriviaResponse(responseMessages));
    let triviaResponse = extractTriviaResponse(responseMessages);
    console.log('typeof Trivia response:', typeof triviaResponse);
    // console.log(triviaResponse[0].text);

    console.log(`parsed response: \n`, JSON.parse(triviaResponse));

    // Assuming triviaResponse is a JSON string, parse it
    // const parsedResponse = JSON.parse(triviaResponse);
    // console.log('Parsed response:', parsedResponse);
    // Destructure the parsed JSON object
    // const { categories } = parsedResponse;

    // Example: Log the categories
    // console.log('Categories:', categories);

    // triviaResponse = fixJson((triviaResponse as string));
    // console.dir(triviaResponse);
    // console.log('Trivia response:\n', triviaResponse);
    //fix json string
    // console.log(`fixed response: `, fixJson((triviaResponse)));
    // console.log('Trivia response JSON:', JSON.stringify(triviaResponse));
    
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
