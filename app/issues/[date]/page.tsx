import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageFrame from "../../components/PageFrame";
import { getIssues } from "../../lib/publication";
import { createPageMetadata } from "../../lib/seo";
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
  return i
    ? createPageMetadata({
        title: i.title,
        description: i.description,
        path: `/issues/${date}/`,
      })
    : {};
}
export default async function Edition({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const issue = getIssues().find((i) => i.date === date);
  if (!issue) notFound();
  // The original Markdown stays intact; render the title and dek only once.
  let articleBody = issue.body.replace(/^# [^\n]+\n+/, "");
  const lead = articleBody.split(/\n\s*\n/)[0];
  if (lead.replace(/[*_`]/g, "") === issue.description) {
    articleBody = articleBody.slice(lead.length).trimStart();
  }
  return (
    <PageFrame>
      <article className="edition">
        <header>
          <p className="pub-kicker">
            DAILY BRIEF · <time>{issue.date}</time>
          </p>
          <h1>{issue.title}</h1>
          <p className="edition-dek">{issue.description}</p>
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
