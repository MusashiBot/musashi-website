import fs from "node:fs";
import path from "node:path";
export const topics = [
  { slug: "markets", name: "Markets", heading: "Today in Prediction Markets" },
  { slug: "tradeable-on-x", name: "Tradeable on X", heading: "Tradeable on X" },
  { slug: "build-this", name: "Build This", heading: "Build This" },
  { slug: "vc-watch", name: "VC Watch", heading: "VC Watch" },
  {
    slug: "resources",
    name: "Resources",
    heading: "Ecosystem & Builder Resources",
  },
];
export type Issue = {
  date: string;
  title: string;
  description: string;
  sourceIssue: string;
  body: string;
};
export function getIssues(): Issue[] {
  const dir = path.join(process.cwd(), "content/issues");
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map((f) => {
      const text = fs.readFileSync(path.join(dir, f), "utf8");
      const split = text.indexOf("\n");
      const meta = JSON.parse(text.slice(0, split));
      return { ...meta, body: text.slice(split + 1) } as Issue;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
export const investors = [
  {
    name: "5c(c) Capital",
    type: "Prediction-market focus",
    note: "Its published thesis centers on event contracts and prediction markets.",
    url: "https://www.5cc.capital/",
    evidence: "https://www.5cc.capital/",
    label: "Published thesis",
  },
  {
    name: "Paradigm",
    type: "Broader technology investor",
    note: "Kalshi appears in its public investments directory.",
    url: "https://www.paradigm.xyz/",
    evidence: "https://www.paradigm.xyz/investments",
    label: "Portfolio evidence",
  },
  {
    name: "1confirmation",
    type: "Broader crypto investor",
    note: "Polymarket has a dedicated page in its portfolio.",
    url: "https://www.1confirmation.com/",
    evidence: "https://www.1confirmation.com/polymarket/",
    label: "Portfolio evidence",
  },
];
export const people = [
  {
    name: "Tarek Mansour",
    role: "Co-founder & CEO, Kalshi",
    why: "Exchange announcements and the operator’s view of the ecosystem.",
    url: "https://news.kalshi.com/p/tarek-mansour",
    label: "Official profile",
  },
  {
    name: "@thenarrator",
    role: "Research & market design",
    why: "A starting point for reading about liquidity and alternative market designs.",
    url: "https://x.com/thenarrator/status/2115243292447191507",
    label: "Read the post",
  },
];
