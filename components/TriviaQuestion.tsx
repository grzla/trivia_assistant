import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface TriviaQuestionProps {
  index: number;
  question: string;
  answer: string;
  onReplace: (index: number) => void;
  onEdit: (index: number, newQuestion: string) => void;
}

const TriviaQuestion: React.FC<TriviaQuestionProps> = ({
  index,
  question,
  answer,
  onReplace,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(index, editedQuestion);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex items-start space-x-4 mb-4 p-4 border rounded">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
        <span className="font-bold">{index + 1}</span>
      </div>
      <div className="flex-grow">
        {isEditing ? (
          <input
            type="text"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
        ) : (
          <p className="mb-2">{question}</p>
        )}
        <p className="text-sm text-gray-600">
          <strong>Answer:</strong> {answer}
        </p>
      </div>
      <div className="flex-shrink-0 space-y-2">
        <Button onClick={() => onReplace(index)} className="w-full">
          Replace
        </Button>
        <Button onClick={handleEdit} className="w-full">
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>
    </div>
  );
};

export default TriviaQuestion;
