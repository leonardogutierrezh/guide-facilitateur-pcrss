// Small, pure helpers for reshaping the faithful markdown bodies for the
// interactive views. They never add or rewrite source content — they only drop
// the parts the surrounding UI already renders (the H1 title, the
// `> Phase · …` breadcrumb, and the activity's task list).

/** Drop a leading H1 title and the `> Phase · …` breadcrumb line from a body,
 *  since the views render their own header. */
export function stripHeader(body: string): string {
  const lines = body.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i < lines.length && /^#\s/.test(lines[i])) i++;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i < lines.length && /^>\s/.test(lines[i])) i++;
  return lines.slice(i).join("\n").trim();
}

/** Build the activity overview: the README minus its own header and minus the
 *  "Tâches de cette activité" list (those become the wizard's task steps). */
export function prepareOverview(body: string): string {
  const stripped = stripHeader(body);
  const lines = stripped.split("\n");
  const out: string[] = [];
  let skipping = false;
  for (const line of lines) {
    if (/^##\s/.test(line)) {
      skipping = /t[âa]ches de cette activit|tasks in this activity/i.test(line);
    }
    if (!skipping) out.push(line);
  }
  return out.join("\n").trim();
}
