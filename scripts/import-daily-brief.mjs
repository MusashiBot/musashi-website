import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const sections = [
  "Today in Prediction Markets",
  "Tradeable on X",
  "Build This",
  "VC Watch",
  "Ecosystem & Builder Resources",
  "Sources",
];
export function parseBrief(issue) {
  const match = /^Daily brief (\d{4}-\d{2}-\d{2})(?::\s*(.+))?$/.exec(
    issue.title || "",
  );
  if (!match) throw Error("Expected Daily brief YYYY-MM-DD: headline");
  const date = match[1];
  if (new Date(date + "T00:00:00Z").toISOString().slice(0, 10) !== date)
    throw Error("Invalid issue date");
  if (!Number.isSafeInteger(issue.number) || issue.number <= 3)
    throw Error("Expected a daily issue number, never the master brief");
  if (
    issue.html_url !==
    `https://github.com/MusashiBot/musashi-website/issues/${issue.number}`
  )
    throw Error("Unexpected source repository");
  if (
    issue.user?.login !== "VittorioC13" &&
    issue.performed_via_github_app?.slug !== "hark"
  )
    throw Error("Daily issue must be authored by the owner or Hark");
  const raw = issue.body;
  if (typeof raw !== "string" || raw.length > 300000)
    throw Error("Missing or oversized Markdown");
  const firstHeading = raw.search(/^#{1,3}\s/m);
  if (firstHeading < 0) throw Error("Missing editorial headings");
  // Strip only the agent instruction preamble; editorial Markdown stays unchanged.
  const body = raw.slice(firstHeading).trim() + "\n";
  const headings = [...body.matchAll(/^#{1,3}\s+(.+?)\s*#*$/gm)];
  let previous = -1;
  for (const name of sections) {
    const h = headings.find(
      (h) =>
        h[1]
          .replace(/^\d+[.)]\s*/, "")
          .trim()
          .toLowerCase() === name.toLowerCase(),
    );
    if (!h || h.index <= previous)
      throw Error("Missing or unordered section: " + name);
    previous = h.index;
  }
  const sources = body.slice(previous);
  if (!/https:\/\//.test(sources))
    throw Error("Sources must link to public evidence");
  if (/\]\(\s*(?:javascript|data|file):/i.test(body))
    throw Error("Unsafe source URL");
  const title = match[2] || `Prediction-market builder briefing · ${date}`;
  const description =
    body
      .split("\n")
      .map((l) => l.trim())
      .find(
        (l) =>
          l && !l.startsWith("#") && !l.startsWith("!") && !l.startsWith("---"),
      )
      ?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .slice(0, 190) || title;
  const metadata = { date, title, description, sourceIssue: issue.html_url };
  return { date, text: JSON.stringify(metadata) + "\n" + body };
}
export function importBrief(issue, directory) {
  const brief = parseBrief(issue);
  fs.mkdirSync(directory, { recursive: true });
  const target = path.join(directory, brief.date + ".md");
  if (fs.existsSync(target)) {
    if (fs.readFileSync(target, "utf8") === brief.text)
      return { file: target, changed: false };
    throw Error(
      "An edition already exists for this date; review changes explicitly before replacing it",
    );
  }
  fs.writeFileSync(target, brief.text, { flag: "wx" });
  return { file: target, changed: true };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const input = process.argv[2];
  if (!input)
    throw Error(
      "Usage: node scripts/import-daily-brief.mjs /absolute/path/to/github-issue.json",
    );
  console.log(
    JSON.stringify(
      importBrief(
        JSON.parse(fs.readFileSync(input, "utf8")),
        path.join(process.cwd(), "content/issues"),
      ),
    ),
  );
}
