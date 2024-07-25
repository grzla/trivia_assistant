#!/bin/bash

for file in ./training/txt/*.txt; do
    name=$(basename "$file" .txt) # Extract filename without extension
    echo "Game $name" >> ./combinedQuestions.txt # Append separator to output file
    cat "$file" >> ./combinedQuestions.txt # Append file content to output file
done
