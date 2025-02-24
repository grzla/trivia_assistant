import {openai } from "@ai-sdk/openai"
import { StreamingTextResponse, streamText } from "ai"

export async function POST(req: Request) {
    const {messages } = await req.json()
    const result = await streamText({
        model: openai('gpt-4o'),
        messages,
    })
    return new StreamingTextResponse(result.toAIStream())
}