"use client";

import { useState, useDeferredValue } from "react";
import dynamic from "next/dynamic";
import NdaChat from "@/components/nda/NdaChat";
import type { NdaFormData } from "@/types/nda";
import { DEFAULT_NDA } from "@/config/ndaDefaults";

const NdaPreviewPane = dynamic(
  () => import("@/components/nda/NdaPreviewPane"),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading preview…</div> }
);

const NdaDownloadButton = dynamic(
  () => import("@/components/nda/NdaDownloadButton"),
  { ssr: false }
);

export default function NdaPage() {
  const [formData, setFormData] = useState<NdaFormData>(DEFAULT_NDA);
  const deferredData = useDeferredValue(formData);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <h1 className="text-xl font-semibold" style={{ color: "#032147" }}>Mutual NDA Creator</h1>
        <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
          Chat with the AI to generate your Mutual Non-Disclosure Agreement
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col">
            <NdaChat
              onFieldsUpdate={setFormData}
              onReset={() => setFormData(DEFAULT_NDA)}
            />
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
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
