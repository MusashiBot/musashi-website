import PageFrame from "../components/PageFrame";
import { investors } from "../lib/publication";
import { createPageMetadata } from "../lib/seo";
export const metadata = createPageMetadata({
  title: "Investor directory",
  description:
    "Evidence-backed starting points for researching prediction-market investors.",
  path: "/investors/",
});
export default function Investors() {
  return (
    <PageFrame>
      <div className="publication-shell directory-page">
        <p className="pub-kicker">THE BUILDER’S DIRECTORY / CAPITAL</p>
        <h1>
          Who backs
          <br />
          <em>prediction markets?</em>
        </h1>
        <p className="pub-dek">
          A focused starting list. Distinguish a dedicated thesis from a
          relevant portfolio investment.
        </p>
        <div className="directory-list">
          {investors.map((i) => (
            <article key={i.name}>
              <span className="directory-tag">{i.type}</span>
              <h2>
                <a href={i.url} target="_blank" rel="noopener noreferrer">
                  {i.name} ↗
                </a>
              </h2>
              <p>{i.note}</p>
              <a
                className="text-action"
                href={i.evidence}
                target="_blank"
                rel="noopener noreferrer"
              >
                {i.label} ↗
              </a>
              <small>
                Source checked November 13, 2026 · Current fundraising and
                applications not confirmed.
              </small>
            </article>
          ))}
        </div>
        <p className="directory-note">
          Inclusion is based on public evidence, not sponsorship or a promise of
          funding. The broader investors listed here are not
          prediction-market-only funds.
        </p>
      </div>
    </PageFrame>
  );
}
