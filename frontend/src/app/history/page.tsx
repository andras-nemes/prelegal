"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface DocumentSummary {
  id: number;
  document_type: string;
  document_name: string;
  fields_json: string;
  updated_at: string;
}

function camelToLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export default function HistoryPage() {
  const { token, email, loading, logout } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [fetching, setFetching] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/documents", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setDocuments)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token]);

  if (loading || !token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f0f4f8" }}
      >
        <div className="text-sm" style={{ color: "#888888" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f4f8" }}>
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: "#209dd7" }}
            >
              &larr; All documents
            </Link>
            <h1 className="text-xl font-semibold" style={{ color: "#032147" }}>
              Document History
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm hidden sm:block" style={{ color: "#888888" }}>
              {email}
            </span>
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
              style={{ color: "#032147" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-10">
        {fetching ? (
          <p className="text-sm" style={{ color: "#888888" }}>
            Loading history...
          </p>
        ) : documents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-semibold mb-2" style={{ color: "#032147" }}>
              No documents yet
            </p>
            <p className="text-sm mb-8" style={{ color: "#888888" }}>
              Start a chat to create your first legal document.
            </p>
            <Link
              href="/"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white"
              style={{ backgroundColor: "#209dd7" }}
            >
              Browse documents
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documents.map((doc) => {
              const fields: Record<string, string> = JSON.parse(doc.fields_json);
              const filledFields = Object.entries(fields).filter(([, v]) => v);
              const isExpanded = expanded === doc.id;
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <button
                    className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : doc.id)}
                  >
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#032147" }}
                      >
                        {doc.document_name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#888888" }}>
                        {`${filledFields.length} ${filledFields.length !== 1 ? "fields" : "field"} filled`}
                        {" · Last updated "}
                        {new Date(doc.updated_at + "Z").toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className="text-lg font-light ml-4 flex-shrink-0"
                      style={{ color: "#209dd7" }}
                    >
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      {filledFields.length === 0 ? (
                        <p
                          className="mt-4 text-sm italic"
                          style={{ color: "#888888" }}
                        >
                          No fields collected yet.
                        </p>
                      ) : (
                        <div className="mt-4 flex flex-col gap-2.5">
                          {filledFields.map(([k, v]) => (
                            <div key={k} className="flex gap-4 text-sm">
                              <span
                                className="w-44 flex-shrink-0 font-medium text-xs pt-0.5"
                                style={{ color: "#555" }}
                              >
                                {camelToLabel(k)}
                              </span>
                              <span
                                className="flex-1 text-sm leading-relaxed"
                                style={{ color: "#1a1a1a" }}
                              >
                                {v}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
