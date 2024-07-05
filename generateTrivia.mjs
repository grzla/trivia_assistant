import 'dotenv/config';
import OpenAI from 'openai';

// Ensure your OPENAI_API_KEY is loaded from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "Trivia Bot",
    instructions: `You are a Trivia Host in Rhode Island. Come up with 5 trivia questions drawing from the following categories: 
      Sports, History, Geography, Science, and Art. Each question should be 30 words or less. 
      Include the answer to the question. The questions should be formatted as follows: 
      Question: <question> Answer: <answer>`,
    // Uncomment and modify the tools array as needed
    // tools: [{ type: "code_interpreter" }],
    model: "gpt-4o",
    temperature: 1,
    top_p: 1
  });

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: "I need some trivia questions. Can you help me?"
    }
  );

  // We use the stream SDK helper to create a run with streaming.
  // The SDK provides helpful event listeners to handle the streamed response.

  const run = openai.beta.threads.runs.stream(thread.id, {
    assistant_id: assistant.id
  })
    .on('textCreated', (text) => process.stdout.write('\nassistant > '))
    .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
    .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
    .on('toolCallDelta', (toolCallDelta, snapshot) => {
      if (toolCallDelta.type === 'code_interpreter') {
        if (toolCallDelta.code_interpreter.input) {
          process.stdout.write(toolCallDelta.code_interpreter.input);
        }
        if (toolCallDelta.code_interpreter.outputs) {
          process.stdout.write("\noutput >\n");
          toolCallDelta.code_interpreter.outputs.forEach(output => {
            if (output.type === "logs") {
              process.stdout.write(`\n${output.logs}\n`);
            }
          });
        }
      }
    });
}

main().catch(console.error);
