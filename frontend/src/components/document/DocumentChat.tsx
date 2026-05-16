"use client";

import { useEffect, useRef, useState } from "react";
import type { DocumentFields } from "@/types/document";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  documentType: string;
  onFieldsUpdate: (fields: DocumentFields) => void;
  onReset: () => void;
}

export default function DocumentChat({ documentType, onFieldsUpdate, onReset }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchAiMessage([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  async function fetchAiMessage(msgs: Message[]) {
    setLoading(true);
    try {
      const res = await fetch("/api/document-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_type: documentType, messages: msgs }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: { message: string; fields: DocumentFields } = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      onFieldsUpdate(data.fields);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${message}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    await fetchAiMessage(updatedMessages);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    setLoading(true);
    setMessages([]);
    onReset();
    fetchAiMessage([]);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 flex-shrink-0">
        <p className="text-xs text-gray-500">Chat with AI to fill in your document</p>
        <button
          onClick={handleReset}
          disabled={loading}
          className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-40 underline"
        >
          Start over
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
              }`}
              style={{
                backgroundColor: msg.role === "user" ? "#753991" : "#209dd7",
                color: "#ffffff",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start" role="status" aria-label="AI is responding">
            <div
              className="rounded-2xl rounded-bl-sm px-4 py-2 text-sm"
              style={{ backgroundColor: "#209dd7" }}
            >
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 px-4 pb-3 pt-2 border-t border-gray-200">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            rows={2}
            aria-label="Chat message"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Type your reply... (Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: "#753991" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
