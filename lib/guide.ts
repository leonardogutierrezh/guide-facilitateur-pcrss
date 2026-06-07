// Typed access to the generated guide bundle (lib/guide-data.json).
import data from "./guide-data.json";

export type Lang = "fr" | "en";

export interface GuideFile {
  slug: string;
  section: string;
  title: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export interface GuideData {
  generatedAt: string;
  fileCount: number;
  files: GuideFile[];
  combined: string;
}

const guide = data as unknown as GuideData;

export const allFiles: GuideFile[] = guide.files;
export const combinedText: string = guide.combined;

export function getFile(slug: string): GuideFile | undefined {
  return guide.files.find((f) => f.slug === slug);
}

export function filesInSection(section: string): GuideFile[] {
  return guide.files.filter((f) => f.section === section);
}
