"use client";
import { useState, useEffect, useRef } from "react";
import { log } from "@/lib/logging";
import Image from "next/image";
import styles from "@/app/ui/home.module.css";
import { lusitana } from "@/app/ui/fonts";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { useAssistant } from "ai/react";
import { Send } from "lucide-react";
import Message from "@/app/components/Messages";

// Constants
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

export default function Home() {
  const { messages, input, submitMessage, handleInputChange } = useAssistant({
    api: "/api/assistant",
  });

  const formRef = useRef<HTMLFormElement>(null);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  const [triviaData, setTriviaData] = useState<any[]>([]);

  // useEffect(() => {
  //   // Function to fetch trivia questions from the API
  //   const fetchTriviaQuestions = async () => {
  //     try {
  //       const response = await fetch("/api/assistant");
  //       const data = await response.json();
  //       // Assuming the response is in the expected format
  //       setTriviaData(data);
  //     } catch (error) {
  //       console.error("Failed to fetch trivia questions:", error);
  //     }
  //   };

  //   fetchTriviaQuestions();
  // }, []);

  /* const triviaData = {
    categories: [
      {
        category: "Pop Culture",
        questions: [
          {
            difficulty: "Easy",
            question:
              "In the animated series SpongeBob SquarePants, in what item does SpongeBob reside?",
            answer: "Pineapple",
          },
          {
            difficulty: "Medium",
            question:
              "Who played Doctor Stephen Strange in the Marvel Cinematic Universe?",
            answer: "Benedict Cumberbatch",
          },
          {
            difficulty: "Medium",
            question:
              "What Canadian acting legend, known for his roles in Animal House and The Hunger Games films, recently passed away at the age of 88?",
            answer: "Donald Sutherland",
          },
        ],
      },
      {
        category: "General Knowledge",
        questions: [
          {
            difficulty: "Easy",
            question: "What is the chemical formula for Carbon Dioxide?",
            answer: "CO2",
          },
          {
            difficulty: "Medium",
            question:
              "What company acquired the headphone company Beats in 2014?",
            answer: "Apple",
          },
          {
            difficulty: "Medium",
            question:
              "In what US state is the city of New London, which is known for its submarine builders and Coast Guard Academy?",
            answer: "Connecticut",
          },
        ],
      },
      {
        category: "Bonus Round",
        questions: [
          {
            difficulty: "Hard",
            question:
              "What European country didn't legalize divorce until 1997?",
            answer: "Ireland",
          },
          {
            difficulty: "Hard",
            question:
              "In Nathaniel Hawthorne's novel The Scarlet Letter, what is the name of the character that is forced to wear a letter ‘A’?",
            answer: "Hester Prynne",
          },
          {
            difficulty: "Hard",
            question: "Cleopatra supposedly took a bath in what liquid?",
            answer: "Milk",
          },
        ],
      },
    ],
  };
*/
  return (
    <main className="fixed h-full w-full flex-col bg-muted">
      <div className="container h-full w-full flex flex-col py-8">
        <div className="flex-1 overflow-y-auto">
          {triviaData ??
            triviaData.categories.map((category, index) => (
              <div key={index}>
                <h1>{category.category}</h1>
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
