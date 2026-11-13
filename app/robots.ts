import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/retired/", "/privacy/legacy-extension/"],
    },
    sitemap: "https://musashi.bot/sitemap.xml",
  };
}
