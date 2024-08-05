"use client";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Constants
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [triviaData, setTriviaData] = useState<any[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Function to fetch trivia questions from the API
    const fetchTriviaQuestions = async () => {
      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId: null,
            message: "Fetch trivia questions",
          }),
        });
        const data = await response.json();
        // Assuming the response is in the expected format
        setTriviaData(data.categories);
      } catch (error) {
        console.error("Failed to fetch trivia questions:", error);
      }
    };

    fetchTriviaQuestions();
  }, []);

  const submitMessage = async (event) => {
    event.preventDefault();
    if (!input) return;

    // Add the user's message to the messages list
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ threadId: null, message: input }),
      });

      const data = await response.json();

      // Add the assistant's response to the messages list
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.assistantMessage },
      ]);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (event: Event) => {
    event ?? setInput(event.target.value);
  };

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <main className="fixed h-full w-full flex-col bg-muted">
      <div className="container h-full w-full flex flex-col py-8">
        <div className="flex-1 overflow-y-auto">
          {triviaData.map((category, index) => (
            <div key={index}>
              <h2>{category.category}</h2>
              <ul>
                {category.questions.map((question, qIndex) => (
                  <li key={qIndex}>
                    <p>
                      <strong>Difficulty:</strong> {question.difficulty}
                    </p>
                    <p>
                      <strong>Question:</strong> {question.question}
                    </p>
                    <p>
                      <strong>Answer:</strong> {question.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
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
            Go
          </Button>
        </form>
      </div>
    </main>
  );
}
