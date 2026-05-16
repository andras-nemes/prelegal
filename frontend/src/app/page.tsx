"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DOCUMENTS, getDocumentHref } from "@/config/documents";
import { useAuth } from "@/context/AuthContext";

export default function CatalogPage() {
  const { token, email, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token, router]);

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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#032147" }}>
              PreLegal
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
              Choose a legal agreement to get started
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/history"
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: "#209dd7" }}
            >
              Document History
            </Link>
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

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOCUMENTS.map((doc) => (
            <Link
              key={doc.slug}
              href={getDocumentHref(doc)}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col"
            >
              <h2
                className="text-base font-semibold mb-2 group-hover:underline"
                style={{ color: "#032147" }}
              >
                {doc.name}
              </h2>
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "#888888" }}
              >
                {doc.description}
              </p>
              <span
                className="mt-4 text-sm font-medium"
                style={{ color: "#209dd7" }}
              >
                Create document &rarr;
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
