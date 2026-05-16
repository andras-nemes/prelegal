"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { NdaFormData } from "@/types/nda";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatApiResponse {
  message: string;
  fields: NdaFormData;
}

interface Props {
  onFieldsUpdate: (fields: NdaFormData) => void;
  onReset: () => void;
}

export default function NdaChat({ onFieldsUpdate, onReset }: Props) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => {
    fetchAiMessage([]);
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: msgs, session_id: sessionId.current }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ChatApiResponse = await res.json();
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
    sessionId.current = crypto.randomUUID();
    setLoading(true);
    setMessages([]);
    onReset();
    fetchAiMessage([]);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 flex-shrink-0">
        <p className="text-xs text-gray-500">Chat with AI to fill in your NDA</p>
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
                msg.role === "user"
                  ? "text-white rounded-br-sm"
                  : "text-white rounded-bl-sm"
              }`}
              style={{
                backgroundColor: msg.role === "user" ? "#753991" : "#209dd7",
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
