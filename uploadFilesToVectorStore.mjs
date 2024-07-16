import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import OpenAI from 'openai';

// Designate training dir
const rootDir = 'training/txt';

// Ensure your OPENAI_API_KEY is loaded from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `You are a Trivia Producer in Rhode Island. Your job is to come up with 30 questions per game. The first 10 questions are Pop Culture. The next set of questions are General Knowledge. The last set of questions is the Bonus Round, in which the questions are intentionally more difficult. Refer to the file search tool to find relevant examples.`;

export async function createAssistant() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Trivia Bot",
      instructions: `${prompt}`,
      tools: [{ type: "file_search" }],
      model: "gpt-4o",
      temperature: 1,
      top_p: 1
    });
    console.log("Assistant created successfully", assistant);
  } catch (error) {
    console.error("Error creating assistant:", error);
  }
}

// Function to recursively find .txt files
async function getTrainingFiles(dir, filePaths = []) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await getTrainingFiles(fullPath, filePaths); // Recurse into subdirectories
    } else if (entry.name.endsWith('.txt')) {
      filePaths.push(fullPath);
    }
  }
  console.log("Found training files:", filePaths);
  return filePaths;
}

// Function to upload files and return their IDs
async function uploadFiles(filePaths) {
  const fileIds = [];
  for (let filePath of filePaths) {
    const fileStream = fs.createReadStream(filePath);
    const response = await openai.files.create({
      file: fileStream,
      purpose: 'fine-tune'
    });
    fileIds.push(response.id);
  }
  return fileIds;
}

// Main logic
(async () => {
  try {
    const txtFiles = await getTrainingFiles(rootDir);
    const fileIds = await uploadFiles(txtFiles);
    console.log("Uploaded files, received file IDs:", fileIds);

    // Create a vector store including our files
    let vectorStore = await openai.beta.vectorStores.create({
      name: "Trivia training data",
      file_ids: fileIds
    });

    console.log(`Vector store id: ${vectorStore.id}`);
  } catch (err) {
    console.error("Error:", err);
  }
})();
