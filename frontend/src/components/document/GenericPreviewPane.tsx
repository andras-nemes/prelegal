"use client";

import { PDFViewer } from "@react-pdf/renderer";
import GenericDocument from "@/pdf/GenericDocument";
import type { DocumentConfig } from "@/config/documents";
import type { DocumentFields } from "@/types/document";

interface Props {
  doc: DocumentConfig;
  fields: DocumentFields;
}

export default function GenericPreviewPane({ doc, fields }: Props) {
  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <GenericDocument doc={doc} fields={fields} />
    </PDFViewer>
  );
}
