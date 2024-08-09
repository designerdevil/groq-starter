import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function resultExtractor(messageArray) {
	const chatCompletion = await getGroqChatCompletion(messageArray);
	// Print the completion returned by the LLM.
	const result = chatCompletion.choices[0]?.message?.content || "";
	return result;
}

export async function getGroqChatCompletion(messageArray=[]) {
	return groq.chat.completions.create({
		messages: [...messageArray],
		model: "llama3-8b-8192",
	});
}

export async function getModels() {
	return groq.models.list();
};