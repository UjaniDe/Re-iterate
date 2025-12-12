// backend/src/services/llmService.js

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.LLM_MODEL || "models/gemini-2.5-flash";

if (!API_KEY) {
  console.warn("⚠ GEMINI_API_KEY missing — LLM will always fallback.");
}

const client = new GoogleGenerativeAI(API_KEY);

/**
 * Run a prompt through Gemini 2.x API
 */
async function runLLM(prompt) {
  if (!API_KEY) return "⚠ No API key — cannot call Gemini.";

  try {
    const model = client.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || "⚠ Gemini returned no text.";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "⚠ LLM failed to generate a response.";
  }
}

module.exports = { runLLM };
