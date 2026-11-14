import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageFrame from "../../components/PageFrame";
import { getIssues } from "../../lib/publication";
import { createPageMetadata } from "../../lib/seo";
import { articlePresentation } from "../../lib/article-presentation.mjs";
export const dynamicParams = false;
export function generateStaticParams() {
  const issues = getIssues();
  return issues.length
    ? issues.map((i) => ({ date: i.date }))
    : [{ date: "pending" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const i = getIssues().find((i) => i.date === date);
  if (!i) return {};
  const base = createPageMetadata({
    title: i.title,
    description: i.description,
    path: `/issues/${date}/`,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article" as const,
      publishedTime: i.date,
      authors: ["https://musashi.bot/"],
    },
  };
}
export default async function Edition({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const issue = getIssues().find((i) => i.date === date);
  if (!issue) notFound();
  const { intro, body: articleBody } = articlePresentation(
    issue.body,
    issue.title,
  );
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: issue.title,
    description: issue.description,
    datePublished: issue.date,
    inLanguage: "en",
    mainEntityOfPage: `https://musashi.bot/issues/${issue.date}/`,
    author: {
      "@type": "Organization",
      name: "Musashi",
      url: "https://musashi.bot/",
    },
    publisher: {
      "@type": "Organization",
      name: "Musashi",
      url: "https://musashi.bot/",
    },
    isBasedOn: issue.sourceIssue,
  };
  return (
    <PageFrame>
      <article className="edition">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
          }}
        />
        <header>
          <p className="pub-kicker">
            DAILY BRIEF · <time>{issue.date}</time>
          </p>
          <h1>{issue.title}</h1>
          <div className="edition-dek">
            {intro ? (
              <ReactMarkdown skipHtml components={{ img: () => null }}>
                {intro}
              </ReactMarkdown>
            ) : (
              issue.description
            )}
          </div>
          <p className="edition-byline">
            Research by Hark · Published by Musashi ·{" "}
            <a href={issue.sourceIssue}>Original research ↗</a>
          </p>
        </header>
        <div className="edition-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            skipHtml
            components={{
              h1: ({ children }) => <h2>{children}</h2>,
              img: () => null,
              a: ({ children, href }) => (
                <a
                  href={href}
                  rel="noopener noreferrer"
                  target={href?.startsWith("https://") ? "_blank" : undefined}
                >
                  {children}
                </a>
              ),
            }}
          >
            {articleBody}
          </ReactMarkdown>
        </div>
        <footer className="edition-end">
          Research and context for builders. Market references are not
          recommendations to trade.
          <br />
          <a href="/feed.xml">Subscribe via RSS ↗</a>
        </footer>
      </article>
    </PageFrame>
  );
}
