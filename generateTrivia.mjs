import 'dotenv/config';


import OpenAI from 'openai';

// Ensure your OPENAI_API_KEY is loaded from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = 'asst_Nofkeq4hkpSru536oeympqrQ'
const prompt = `You are a Trivia Producer in Rhode Island. Your job is to come up with 30 questions per game. The first 10 questions are Pop Culture. The next set of questions are General Knowledge. The last set of questions is the Bonus Round, in which the questions are intentionally more difficult.`

async function main() {

  // const assistant = await openai.beta.assistants.create({
  //   name: "Trivia Bot",
  //   instructions: `${prompt}`,
  //   tools: [{ type: "file_search" }],
  //   model: "gpt-4o",
  //   temperature: 1,
  //   top_p: 1
  // });

  const assistant = await openai.beta.assistants.retrieve(assistantId);

  console.log(assistant);

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

  // not-streaming example: https://platform.openai.com/docs/assistants/tools/file-search/step-5-create-a-run-and-check-the-output
  }

  

main().catch(console.error);
