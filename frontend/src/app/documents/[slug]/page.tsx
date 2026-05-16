import { DOCUMENTS } from "@/config/documents";
import DocumentPageClient from "./DocumentPageClient";

export function generateStaticParams() {
  return DOCUMENTS.filter((d) => !d.useNdaRoute).map((d) => ({ slug: d.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <DocumentPageClient slug={slug} />;
}
