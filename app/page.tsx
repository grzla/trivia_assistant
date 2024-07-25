"use client";
import Image from "next/image";
import styles from "@/app/ui/home.module.css";
import { lusitana } from "@/app/ui/fonts";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/ui/button";
// Import your assistant hook here
import { useAssistant } from "ai/react";
import { Send } from "lucide-react";
import Message from "@/app/components/Messages";
import { useRef } from "react";

// Constants
const ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID;

export default function Home() {
  // Use the assistant hook, passing the assistantId
  const { messages, input, submitMessage, handleInputChange } = useAssistant({
    api: "/api/assistant",
  });

  const formRef = useRef<HTMLFormElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <main className="fixed h-full w-full flex-col bg-muted">
      <div className="container h-full w-full flex flex-col py-8">
        <div className="flex-1 overflow-y-auto">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <form
          ref={formRef}
          onSubmit={submitMessage}
          className="mt-auto relative"
        >
          <Textarea
            className="w-full text-lg"
            placeholder="Say something"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input}
            className="absolute top-1/2 transform -translate-y-1/2 right-4 rounded-full"
          >
            {" "}
            <div className="leading-none">{"Go"}</div>
            {/* <Send size={24} /> */}
          </Button>
        </form>
      </div>
    </main>
  );
}
