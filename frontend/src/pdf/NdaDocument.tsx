import { Document } from "@react-pdf/renderer";
import type { NdaFormData } from "@/types/nda";
import CoverPage from "./CoverPage";
import StandardTermsPage from "./StandardTermsPage";

interface Props {
  data: NdaFormData;
}

export default function NdaDocument({ data }: Props) {
  return (
    <Document
      title="Mutual Non-Disclosure Agreement"
      author="PreLegal"
      subject="Mutual NDA"
    >
      <CoverPage data={data} />
      <StandardTermsPage />
    </Document>
  );
}
