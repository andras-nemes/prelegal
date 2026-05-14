"use client";

import { PDFViewer } from "@react-pdf/renderer";
import NdaDocument from "@/pdf/NdaDocument";
import type { NdaFormData } from "@/types/nda";

interface Props {
  data: NdaFormData;
}

export default function NdaPreviewPane({ data }: Props) {
  return (
    <PDFViewer className="w-full h-full" showToolbar={false}>
      <NdaDocument data={data} />
    </PDFViewer>
  );
}
