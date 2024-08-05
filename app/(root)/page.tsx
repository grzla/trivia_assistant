"use client";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/ui/button";
import TriviaQuestion from "@/components/TriviaQuestion";
import { sampleTriviaData } from "@/lib/utils";

// Constants
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // const [triviaData, setTriviaData] = useState<any[]>([]);
  const [triviaData, setTriviaData] = useState(sampleTriviaData);

  const formRef = useRef<HTMLFormElement>(null);

  // useEffect(() => {
  //   setTriviaData(sampleTriviaData);
  // }, []);
  /*
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
            message: "Go",
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
*/
  const submitMessage = async (event) => {
    event.preventDefault();
    if (!input) return;

    // Add the user's message to the messages list
    const newMessage = [...messages, { role: "user", content: input }];
    setMessages(newMessage);

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
        ...newMessage,
        { role: "assistant", content: data.assistantMessage },
      ]);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  const handleReplace = (index: number) => {
    // Implement the replace logic here
    console.log(`Replace question at index ${index}`);
  };

  const handleEdit = (index: number, newQuestion: string) => {
    setTriviaData((prevData) => {
      const newData = [...prevData];
      newData[index].questions[0].question = newQuestion;
      return newData;
    });
  };

  return (
    <main className="fixed h-full w-full flex-col bg-muted">
      <div className="container h-full w-full flex flex-col py-8">
        <div className="flex-1 overflow-y-auto">
          {triviaData.categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2>{category.category}</h2>
              {category.questions.map((question, questionIndex) => (
                <TriviaQuestion
                  key={questionIndex}
                  index={questionIndex}
                  question={question.question}
                  answer={question.answer}
                  onReplace={handleReplace}
                  onEdit={handleEdit}
                />
              ))}
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
