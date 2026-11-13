import Link from "next/link";
import { notFound } from "next/navigation";
import PageFrame from "../../components/PageFrame";
import { topics, getIssues } from "../../lib/publication";
import { createPageMetadata } from "../../lib/seo";
export const dynamicParams = false;
export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const t = topics.find((t) => t.slug === topic);
  return t
    ? createPageMetadata({
        title: t.name,
        description: `Musashi briefings covering ${t.name}.`,
        path: `/topics/${topic}/`,
      })
    : {};
}
export default async function Topic({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const t = topics.find((t) => t.slug === topic);
  if (!t) notFound();
  const issues = getIssues().filter((i) => i.body.includes(t.heading));
  return (
    <PageFrame>
      <div className="publication-shell directory-page">
        <p className="pub-kicker">EXPLORE THE BRIEFING</p>
        <h1>{t.name}</h1>
        <p className="pub-dek">
          Daily editions that include {t.heading.toLowerCase()}.
        </p>
        {issues.length ? (
          issues.map((i) => (
            <Link
              className="issue-row"
              href={`/issues/${i.date}/`}
              key={i.date}
            >
              <time>{i.date}</time>
              <h2>{i.title}</h2>
              <p>{i.description}</p>
            </Link>
          ))
        ) : (
          <div className="publication-empty">
            <p>No daily editions published in this topic yet.</p>
            <Link href="/archive/">Visit the archive ↗</Link>
          </div>
        )}
      </div>
    </PageFrame>
  );
}
