"use client";

import { useEffect, useState, useDeferredValue } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NdaChat from "@/components/nda/NdaChat";
import { useAuth } from "@/context/AuthContext";
import type { NdaFormData } from "@/types/nda";
import { DEFAULT_NDA } from "@/config/ndaDefaults";

const NdaPreviewPane = dynamic(
  () => import("@/components/nda/NdaPreviewPane"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Loading preview...
      </div>
    ),
  }
);

const NdaDownloadButton = dynamic(
  () => import("@/components/nda/NdaDownloadButton"),
  { ssr: false }
);

export default function NdaPage() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<NdaFormData>(DEFAULT_NDA);
  const deferredData = useDeferredValue(formData);

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
    }
  }, [loading, token, router]);

  if (loading || !token) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#f0f4f8" }}>
        <div className="text-sm" style={{ color: "#888888" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 flex items-center gap-4">
        <Link
          href="/"
          className="text-sm hover:opacity-80 transition-opacity flex-shrink-0"
          style={{ color: "#209dd7" }}
        >
          &larr; All documents
        </Link>
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "#032147" }}>
            Mutual NDA Creator
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
            Chat with the AI to generate your Mutual Non-Disclosure Agreement
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <NdaChat
              onFieldsUpdate={setFormData}
              onReset={() => setFormData(DEFAULT_NDA)}
            />
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 flex flex-col gap-3">
            <p className="text-xs rounded-lg px-3 py-2 leading-relaxed" style={{ backgroundColor: "#fef9e7", color: "#7a5c00", border: "1px solid #f0d060" }}>
              This document is a draft and should be reviewed by a qualified legal professional before use.
            </p>
            <NdaDownloadButton data={deferredData} />
          </div>
        </aside>

        <main className="flex-1 overflow-hidden bg-gray-100 p-4">
          <div className="h-full rounded-lg overflow-hidden shadow-sm">
            <NdaPreviewPane data={deferredData} />
          </div>
        </main>
      </div>
    </div>
  );
}
