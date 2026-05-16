"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import GenericDocument from "@/pdf/GenericDocument";
import type { DocumentConfig } from "@/config/documents";
import type { DocumentFields } from "@/types/document";

interface Props {
  doc: DocumentConfig;
  fields: DocumentFields;
}

export default function GenericDownloadButton({ doc, fields }: Props) {
  const filename = `${doc.slug}.pdf`;

  return (
    <PDFDownloadLink
      document={<GenericDocument doc={doc} fields={fields} />}
      fileName={filename}
      className="block w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: "#ecad0a", color: "#032147" }}
    >
      {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
    </PDFDownloadLink>
  );
}
