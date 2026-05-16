"use client";

import Link from "next/link";
import { DOCUMENTS, getDocumentHref } from "@/config/documents";

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <h1 className="text-2xl font-bold" style={{ color: "#032147" }}>
          PreLegal
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
          Choose a legal agreement to get started
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOCUMENTS.map((doc) => (
            <Link
              key={doc.slug}
              href={getDocumentHref(doc)}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col"
            >
              <h2
                className="text-base font-semibold mb-2 group-hover:underline"
                style={{ color: "#032147" }}
              >
                {doc.name}
              </h2>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "#888888" }}>
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
