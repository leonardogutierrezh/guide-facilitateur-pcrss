import { notFound } from "next/navigation";
import { NAV } from "@/lib/nav";
import { SectionView } from "./SectionView";

export function generateStaticParams() {
  return NAV.map((s) => ({ id: s.id }));
}

export default async function SectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const section = NAV.find((s) => s.id === id);
  if (!section) notFound();
  return <SectionView id={id} />;
}
