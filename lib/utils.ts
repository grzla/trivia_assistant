import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sampleTriviaData = 
{
	"categories": [
		{
			"category": "Pop Culture",
			"questions": [
				{
					"difficulty": "Easy",
					"question": "In the animated series SpongeBob SquarePants, in what item does SpongeBob reside?",
					"answer": "Pineapple"
				},
				{
					"difficulty": "Medium",
					"question": "Which Maroon 5 singer will be back as a coach for season 27 of The Voice, scheduled to air next spring?",
					"answer": "Adam Levine"
				},
				{
					"difficulty": "Medium",
					"question": "What is the first cable television series to win an Emmy for ‘Outstanding Drama Series’?",
					"answer": "The Sopranos"
				}
			]
		},
		{
			"category": "General Knowledge",
			"questions": [
				{
					"difficulty": "Easy",
					"question": "What type of dried fruit is a raisin?",
					"answer": "Grape"
				},
				{
					"difficulty": "Medium",
					"question": "What NFL franchise was the first to win five Super Bowls titles?",
					"answer": "San Francisco 49ers"
				},
				{
					"difficulty": "Medium",
					"question": "What is the name of the device that measures atmospheric pressure?",
					"answer": "Barometer"
				}
			]
		},
		{
			"category": "Bonus Round",
			"questions": [
				{
					"difficulty": "Hard",
					"question": "Located on the grounds of Hogwarts School, what tree nearly demolished the Weasley family's flying Ford Anglia?",
					"answer": "Whomping Willow"
				},
				{
					"difficulty": "Hard",
					"question": "What is the scientific term for the study of low temperatures?",
					"answer": "Cryogenics"
				},
				{
					"difficulty": "Hard",
					"question": "What European island was awarded the George Cross for bravery in 1942?",
					"answer": "Malta"
				}
			]
		}
	]
}