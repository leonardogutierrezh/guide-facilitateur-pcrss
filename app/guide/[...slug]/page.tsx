import { notFound } from "next/navigation";
import { allFiles, getFile } from "@/lib/guide";
import { GuideArticle } from "./GuideArticle";

export function generateStaticParams() {
  return allFiles.map((f) => ({ slug: f.slug.split("/") }));
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const joined = slug.join("/");
  const file = getFile(joined);
  if (!file) notFound();
  return <GuideArticle slug={file.slug} title={file.title} body={file.body} />;
}
