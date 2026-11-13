import Link from "next/link";
import PageFrame from "../components/PageFrame";
import { getIssues } from "../lib/publication";
import { createPageMetadata } from "../lib/seo";
export const metadata = createPageMetadata({
  title: "Briefing archive",
  description: "Every Musashi briefing for prediction-market builders.",
  path: "/archive/",
});
export default function Archive() {
  const issues = getIssues();
  return (
    <PageFrame>
      <div className="publication-shell directory-page">
        <p className="pub-kicker">THE ARCHIVE</p>
        <h1>
          Every edition.
          <br />
          <em>A clearer picture.</em>
        </h1>
        <p className="pub-dek">Daily research, preserved with its sources.</p>
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
            <h2>Waiting for the first daily brief.</h2>
            <p>
              There are no published daily editions yet. New research will
              appear here after publication.
            </p>
            <Link href="/investors/">Explore the investor directory ↗</Link>
          </div>
        )}
      </div>
    </PageFrame>
  );
}
