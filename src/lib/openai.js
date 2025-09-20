import OpenAI from "openai";

export const OPENAI_CHAT_MODEL = "gpt-4o-mini";
export const OPENAI_EMBED_MODEL = "text-embedding-3-small"; // ✅ matches your 1536-dim setup

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embedding for given text
 * @param {string} text
 * @returns {Promise<number[]>} embedding vector
 */
export async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: OPENAI_EMBED_MODEL,
    input: text,
  });

  return response.data[0].embedding;
}
