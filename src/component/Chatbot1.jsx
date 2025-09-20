// components/Chatbot.jsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // {role, text}
  const [streaming, setStreaming] = useState(false);
  const evtSourceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (evtSourceRef.current) {
        evtSourceRef.current.cancel && evtSourceRef.current.cancel();
        evtSourceRef.current = null;
      }
    };
  }, []);

  async function sendQuestion(e) {
    e.preventDefault();
    if (!question.trim()) return;
    const userMsg = { role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");
    // Start fetch and stream
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        setMessages((m) => [
          ...m,
          { role: "assistant", text: "Error: " + text },
        ]);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      const readLoop = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          // The server sends SSE events; parse "event: message\ndata: {...}\n\n"
          const events = chunk.split(/\n\n/).filter(Boolean);
          for (const ev of events) {
            if (ev.startsWith("event: message")) {
              const match = ev.match(/data: (.*)/s);
              if (match) {
                try {
                  const payload = JSON.parse(match[1]);
                  const token = payload.token || "";
                  assistantText += token;
                  // update last assistant segment in messages (optimistic)
                  setMessages((m) => {
                    const copy = [...m];
                    // If last message is assistant and streaming add to it; otherwise push new
                    if (
                      copy.length &&
                      copy[copy.length - 1].role === "assistant" &&
                      streaming
                    ) {
                      copy[copy.length - 1].text = assistantText;
                    } else {
                      copy.push({ role: "assistant", text: assistantText });
                    }
                    return copy;
                  });
                } catch (err) {
                  // ignore parse error
                }
              }
            } else if (ev.startsWith("event: done")) {
              // stream done
            }
          }
        }
      };

      await readLoop();
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Error: " + String(err) },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 360,
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: "#0f172a",
            color: "#fff",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Incident Chatbot</div>
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "transparent", color: "#fff", border: "none" }}
          >
            {open ? "Close" : "Open"}
          </button>
        </div>

        {open ? (
          <div
            style={{
              padding: 12,
              maxHeight: 420,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <b style={{ textTransform: "capitalize" }}>{m.role}:</b>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={sendQuestion} style={{ display: "flex", gap: 8 }}>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about incidents..."
                style={{ flex: 1 }}
              />
              <button type="submit" disabled={streaming}>
                {streaming ? "..." : "Send"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ padding: 12 }}>
            <small>Click Open to chat with the incident assistant</small>
          </div>
        )}
      </div>
    </>
  );
}
