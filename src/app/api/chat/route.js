// src/app/api/chat/route.js
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { queryReports } from "../../../lib/vector-search";
import { OPENAI_CHAT_MODEL } from "../../../lib/openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { messages } = await req.json();
    // messages = [{ role: "user"|"assistant"|"system", content: "..." }, ...]

    // 1. Find latest user question
    const latestMessage = messages
      .filter((m) => m.role === "user")
      .slice(-1)[0];
    const question = latestMessage?.content || "";

    // 2. Search embeddings using ONLY the latest question
    const reports = await queryReports(question);

    // 3. Convert reports into readable context
    const context = reports
      .map(
        (r) =>
          `• On ${r.date} at ${r.location}: ${r.incidentType} — ${
            r.details || "No extra details provided."
          }`
      )
      .join("\n");

    // 4. Build system instruction
    const systemPrompt = {
      role: "system",
      content: `
You are an incident intelligence assistant.
You must combine:
1) The full conversation history so far
2) The provided incident report context (if available)

Where multiple context is provided, use the one that most closely alligns and answers the question asked.
If no context is relevant, respond with a statement that clearly states that no available data answers the question asked.
Keep answers concise and reference report date/location if possible.
No fictional response or hallucination. Respond to greetings and compliments accordingly.Avoid unnecessary blank lines or extra paragraph breaks. Use compact Markdown.
      `.trim(),
    };

    // 5. Build final message array:
    // - system prompt first
    // - full chat history
    // - then inject a *system-style note* with context
    const finalMessages = [
      systemPrompt,
      ...messages,
      {
        role: "system", // ⬅️ inject context as system, not as user
        content: `Relevant reports:\n${context || "No records found."}`,
      },
    ];

    // console.log(reports)
    // console.log(messages)
    // console.log(finalMessages)
    // 6. Call OpenAI with streaming
    const response = await openai.responses.stream({
      model: OPENAI_CHAT_MODEL,
      input: finalMessages,
      max_output_tokens: 800,
    });

    // 7. Convert SSE → plain text stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const event of response) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(event.delta));
          } else if (event.type === "response.completed") {
            controller.close();
          }
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Chat stream error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
