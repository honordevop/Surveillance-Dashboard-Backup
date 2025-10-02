"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function removeMarkdownLineBreaks(markdown) {
  return markdown.replace(/ {2,}\n/g, " "); // replace "  \n" with a space
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const maxRetries = 3;
    let attempts = 0;
    let success = false;

    // Helper to delay between retries
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    while (attempts <= maxRetries && !success) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({ messages: newMessages }),
        });

        // Retry only if server returns 500+ or is not OK
        if (!res.ok) {
          console.warn(
            `Attempt ${attempts + 1} failed with status ${res.status}`
          );
          attempts++;
          if (attempts > maxRetries) throw new Error("Max retries exceeded");
          await delay(1000); // Wait 1s before retry
          continue;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = { role: "assistant", content: "" };

        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantMessage.content += chunk;

          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { ...assistantMessage };
            return copy;
          });
        }

        success = true;
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed`, error);
        attempts++;
        if (attempts > maxRetries) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "⚠️ Sorry, I'm having trouble responding right now. Please try again later.",
            },
          ]);
        } else {
          await delay(1000); // Wait 1s before retry
        }
      }
    }

    setLoading(false);
  }
  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const maxRetries = 3;
    let attempts = 0;
    let success = false;

    // Helper to delay between retries
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    while (attempts <= maxRetries && !success) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({ messages: newMessages }),
        });

        // Retry only if server returns 500+ or is not OK
        if (!res.ok) {
          console.warn(
            `Attempt ${attempts + 1} failed with status ${res.status}`
          );
          attempts++;
          if (attempts > maxRetries) throw new Error("Max retries exceeded");
          await delay(1000); // Wait 1s before retry
          continue;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = { role: "assistant", content: "" };

        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantMessage.content += chunk;

          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { ...assistantMessage };
            return copy;
          });
        }

        success = true;
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed`, error);
        attempts++;
        if (attempts > maxRetries) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Sorry, I'm having trouble responding right now. Please try again later.",
            },
          ]);
        } else {
          await delay(1000); // Wait 1s before retry
        }
      }
    }

    setLoading(false);
  }

  return (
    <div className="fixed bottom-4 right-4">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#0F172A] text-white p-3 rounded-full shadow-lg hover:bg-[#0f172ab4] cursor-pointer"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-[300px] md:w-96 max-h-[70vh] bg-white shadow-xl rounded-2xl border flex flex-col">
          <div className="p-3 bg-[#0F172A] text-white font-bold flex justify-between items-center rounded-t-lg">
            <span>AI Chatbot</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white cursor-pointer"
            >
              ✖
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 h-80">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`p-2 rounded-lg leading-snug text-sm whitespace-pre-wrape ${
                    msg.role === "user" ? "bg-gray-700" : "bg-gray-800"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="my-2">{children}</p>,
                      br: () => <div className="h-2" />, // adjust spacing here (e.g., h-0.5, h-1)
                      li: ({ children }) => (
                        <li className="my-8 ml-4 list-disc">{children}</li>
                      ), // Compact list items
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && <div className="text-gray-400">Typing...</div>}
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-2 flex">
            <input
              className="flex-1 border text-black outline border-white rounded px-2 py-1 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <button
              type="submit"
              disabled={loading}
              className="ml-2 bg-[#0F172A] text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
