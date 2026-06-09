import { notFound } from "next/navigation";
import { allFiles, getFile } from "@/lib/guide";
import { findEntry } from "@/lib/nav";
import { GuideArticle } from "./GuideArticle";
import { ActivityFlow } from "./ActivityFlow";
import { TaskView } from "./TaskView";

export function generateStaticParams() {
  return allFiles.map((f) => ({ slug: f.slug.split("/") }));
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const joined = slug.join("/");
  const file = getFile(joined);
  if (!file) notFound();

  const entry = findEntry(joined);

  // A task file → dedicated task detail view (how to perform it).
  if (entry?.task) {
    const fm = file.frontmatter as Record<string, unknown>;
    return (
      <TaskView
        slug={file.slug}
        body={file.body}
        meta={{ source: fm.source as string | undefined }}
      />
    );
  }

  // An activity README that has task children → guided step-by-step flow.
  const children = entry && !entry.task ? entry.activity.children ?? [] : [];
  if (entry && !entry.task && children.length > 0) {
    const steps = children.map((c) => ({ slug: c.slug, body: getFile(c.slug)?.body ?? "" }));
    const fm = file.frontmatter as Record<string, unknown>;
    return (
      <ActivityFlow
        slug={file.slug}
        overviewBody={file.body}
        steps={steps}
        meta={{
          step: fm.step as number | string | undefined,
          source: fm.source as string | undefined,
          actors: fm.actors as string[] | undefined,
          forms: fm.forms as string[] | undefined,
        }}
      />
    );
  }

  return <GuideArticle slug={file.slug} title={file.title} body={file.body} />;
}
