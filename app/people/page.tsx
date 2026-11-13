import PageFrame from "../components/PageFrame";
import { people } from "../lib/publication";
import { createPageMetadata } from "../lib/seo";
export const metadata = createPageMetadata({
  title: "People to follow",
  description: "A curated reading list for prediction-market builders.",
  path: "/people/",
});
export default function People() {
  return (
    <PageFrame>
      <div className="publication-shell directory-page">
        <p className="pub-kicker">THE BUILDER’S DIRECTORY / PEOPLE</p>
        <h1>
          Follow the people.
          <br />
          <em>Understand the ideas.</em>
        </h1>
        <p className="pub-dek">
          A small editorial watchlist for exchange developments and
          market-design research.
        </p>
        <div className="directory-list">
          {people.map((p) => (
            <article key={p.name}>
              <span className="directory-tag">{p.role}</span>
              <h2>{p.name}</h2>
              <p>{p.why}</p>
              <a
                className="text-action"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.label} ↗
              </a>
            </article>
          ))}
        </div>
        <p className="directory-note">
          This is a reading list, not a popularity ranking. We’ll add rankings
          only when there is a clear method and supporting data.
        </p>
      </div>
    </PageFrame>
  );
}
