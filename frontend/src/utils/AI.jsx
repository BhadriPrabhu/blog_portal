import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function GenAI(aiPrompt) {

    const chatApi = import.meta.env.VITE_API_GEMINI_KEY || AIzaSyBgITgqMKXA6H2gGA6K5WOC-r5qp6_2eIc;

    if (!chatApi) {
        throw new Error("Gemini API key is missing");
    }

    const genAI = new GoogleGenerativeAI(chatApi);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = aiPrompt;

    const result = await model.generateContent(prompt);
    return result;
}