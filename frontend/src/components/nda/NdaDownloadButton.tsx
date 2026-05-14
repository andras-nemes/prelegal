"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import NdaDocument from "@/pdf/NdaDocument";
import type { NdaFormData } from "@/types/nda";

interface Props {
  data: NdaFormData;
}

function sanitize(s: string): string {
  return s.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "") || "party";
}

export default function NdaDownloadButton({ data }: Props) {
  const filename = `mutual-nda-${sanitize(data.party1Company)}-${sanitize(data.party2Company)}.pdf`;

  return (
    <PDFDownloadLink document={<NdaDocument data={data} />} fileName={filename}>
      {({ loading }) => (
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
        >
          {loading ? "Preparing PDF…" : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
