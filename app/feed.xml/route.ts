import { getIssues } from "../lib/publication";
export const dynamic = "force-static";
const esc = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
export function GET() {
  const items = getIssues()
    .map(
      (i) =>
        `<item><title>${esc(i.title)}</title><link>https://musashi.bot/issues/${i.date}/</link><guid isPermaLink="true">https://musashi.bot/issues/${i.date}/</guid><pubDate>${new Date(i.date + "T00:00:00Z").toUTCString()}</pubDate><description>${esc(i.description)}</description></item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Musashi</title><link>https://musashi.bot/</link><description>The daily briefing for prediction-market builders.</description><language>en</language>${items}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
