import 'dotenv/config';
import OpenAI from 'openai';

// Ensure your OPENAI_API_KEY is loaded from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTrivia() {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": "Hello!"}],
    });
    console.log(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}

// Example usage
generateTrivia();
