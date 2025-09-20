// app/api/chat/route.js
import { queryReports } from "../../../lib/vector-search";
import { OPENAI_CHAT_MODEL } from "../../../lib/openai";
// import fetch from "node-fetch"; // Next.js may polyfill fetch; we include node-fetch fallback if needed

export async function POST(req) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Invalid question" }), { status: 400 });
    }

    // 1) Find top relevant reports (k = 5)
    const top = await queryReports(question, 5);

    // 2) Build context text
    const contexts = top.map((r, i) => {
      // if `r.date` is a Date instance or string, ensure format
      let date = r.date;
      if (date instanceof Date) date = date.toISOString().slice(0, 10);
      return `Report ${i + 1}:\nDate: ${date}\nLocation: ${r.location}\nIncident Type: ${r.incidentType}\nDetails: ${r.details}`;
    }).join("\n\n---\n\n");

    const systemPrompt = `You are an incident intelligence assistant. Use the provided context from past daily incident reports to answer the user's question. If the answer is not contained in the context, say so and provide best-practice suggestions. Keep answers concise and cite which report you used when appropriate.`;

    const userPrompt = `Context:\n${contexts}\n\nUser Question:\n${question}`;

    // 3) Call OpenAI Responses streaming endpoint using fetch (stream: true)
    // We'll forward chunked data as SSE "data: ..." lines.
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) throw new Error("Missing OPENAI_API_KEY");

    const payload = {
      model: OPENAI_CHAT_MODEL,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
       max_output_tokens: 800,
      temperature: 0.2,
      stream: true
    };

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenAI error:", text);
      return new Response(JSON.stringify({ error: "OpenAI error" }), { status: 500 });
    }

    // Create a ReadableStream that forwards OpenAI chunks to client as SSE
    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body.getReader();

        function push(data) {
          controller.enqueue(encoder.encode(data));
        }

        // First, send a "data: [OPEN]" event to prime client
        push("event: open\n\n");

        // Read OpenAI stream and forward each data: line
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkText = decoder.decode(value, { stream: true });

          // OpenAI streams NDJSON lines separated by \n\n
          // Each line may be "data: {json}" or "data: [DONE]"
          // The Responses API returns JSON lines; we forward each chunk as SSE data event
          // We'll wrap raw JSON chunk into a JSON string sent as event 'message'
          const lines = chunkText.split(/\r?\n/).filter(Boolean);
          for (const line of lines) {
            // each line may start with "data: "
            let payloadLine = line;
            if (line.startsWith("data: ")) payloadLine = line.replace(/^data: /, "");
            if (payloadLine === "[DONE]") {
              push("event: done\ndata: [DONE]\n\n");
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(payloadLine);
              // The Responses API often includes output[0].content[0].text or similar
              // We try to extract text if present, else send the full parsed object
              let textChunk = "";
              if (parsed.output && Array.isArray(parsed.output)) {
                // Responses API: output can contain items with 'content'
                for (const item of parsed.output) {
                  if (item?.content?.length) {
                    for (const c of item.content) {
                      if (typeof c === "string") textChunk += c;
                      else if (c?.text) textChunk += c.text;
                    }
                  }
                }
              } else if (parsed.delta?.content) {
                // Chat-style delta
                textChunk = parsed.delta.content;
              } else if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                textChunk = parsed.choices[0].delta?.content || "";
              } else {
                textChunk = JSON.stringify(parsed);
              }

              if (textChunk) {
                // send as SSE message event with JSON payload { token: "..."}
                const ssePayload = `event: message\ndata: ${JSON.stringify({ token: textChunk })}\n\n`;
                push(ssePayload);
              }
            } catch (err) {
              // not JSON - push raw
              const ssePayload = `event: message\ndata: ${JSON.stringify({ token: payloadLine })}\n\n`;
              push(ssePayload);
            }
          }
        }
        // If we exit loop without [DONE], close stream
        push("event: done\ndata: [DONE]\n\n");
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("chat error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
