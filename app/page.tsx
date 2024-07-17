"use client";
import Image from "next/image";
import styles from "@/app/ui/home.module.css";
import { lusitana } from "@/app/ui/fonts";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import Message from "@/app/components/Messages";
import { useRef } from "react";

export default function Home() {
  const { messages, handleSubmit, input, handleInputChange } = useChat();
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
          onSubmit={handleSubmit}
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
            <Send size={24} />
          </Button>
        </form>
      </div>
    </main>
  );
  // <main className="flex min-h-screen flex-col items-center justify-around p-24">
  //   <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"></div>
  //   <div className={styles.shape} />
  //   <div>HELLO</div>
  //   <div className={`${lusitana.className} large-font`}>HELLO</div>
  //   {/* <p
  //   className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
  // > */}
  // </main>
}
