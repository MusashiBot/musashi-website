import type { Metadata } from "next";

export const SITE_URL = "https://musashi.bot";
export const SITE_NAME = "Musashi";
export const SITE_DESCRIPTION =
  "The daily briefing for prediction-market builders. Sourced research, investors, people, and ideas worth building.";

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  ogTitle?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · Musashi`,
      description,
      url: `${SITE_URL}${path}`,

      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Musashi`,
      description,
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
