import type { MetadataRoute } from "next";
import { getIssues, topics } from "./lib/publication";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/archive/",
    "/investors/",
    "/people/",
    "/extension/",
    "/samples/",
    "/docs/",
    "/privacy/",
    ...topics.map((t) => `/topics/${t.slug}/`),
    ...getIssues().map((i) => `/issues/${i.date}/`),
  ].map((path) => ({
    url: `https://musashi.bot${path}`,
    changeFrequency: "daily" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
