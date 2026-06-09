// Hex values for the Tailwind palette tokens used in the section gradient
// strings (stored in guide-data.json), so we can drive runtime tints, strokes
// and progress fills without hard-coding a colour per section.

export const TW: Record<string, string> = {
  "green-500": "#22c55e", "green-600": "#16a34a",
  "lime-500": "#84cc16",
  "amber-500": "#f59e0b", "amber-600": "#d97706",
  "orange-500": "#f97316", "orange-600": "#ea580c",
  "rose-500": "#f43f5e", "red-600": "#dc2626",
  "sky-500": "#0ea5e9", "blue-600": "#2563eb",
  "teal-500": "#14b8a6", "cyan-600": "#0891b2",
  "purple-500": "#a855f7", "fuchsia-600": "#c026d6",
  "indigo-500": "#6366f1", "violet-600": "#7c3aed",
};

/** Parse a "from-x-500 to-y-600" gradient class into a [fromHex, toHex] pair. */
export function pairOf(color: string): [string, string] {
  const from = color.match(/from-([a-z]+-\d+)/)?.[1] ?? "";
  const to = color.match(/to-([a-z]+-\d+)/)?.[1] ?? "";
  return [TW[from] ?? "#b14a1f", TW[to] ?? "#8a3713"];
}

export function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
