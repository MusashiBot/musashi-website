import Link from "next/link";
import PageFrame from "./components/PageFrame";
import { getIssues, topics, investors } from "./lib/publication";
export default function Home() {
  const issues = getIssues();
  const latest = issues[0];
  return (
    <PageFrame>
      <div className="publication-shell">
        <section className="publication-intro">
          <p className="pub-kicker">INDEPENDENT RESEARCH · MUSASHI</p>
          <h1>
            The daily briefing for
            <br />
            <em>prediction-market builders.</em>
          </h1>
          <p className="pub-dek">
            The news worth your time. The people worth following.
            <br className="desktop-break" /> The opportunities worth building.
          </p>
          <a className="pub-button" href="/feed.xml">
            Subscribe via RSS <span>↗</span>
          </a>
          <p className="pub-fine">
            Open access. Original sources. A builder’s perspective.
          </p>
        </section>
        <nav className="topic-nav" aria-label="Explore topics">
          {topics.map((t) => (
            <Link href={`/topics/${t.slug}/`} key={t.slug}>
              {t.name}
            </Link>
          ))}
        </nav>
        <section className="pub-featured">
          <div className="pub-section-label">
            <span>{latest ? "LATEST BRIEFING" : "THE PUBLICATION"}</span>
            <Link href="/archive/">All issues ↗</Link>
          </div>
          {latest ? (
            <Link className="feature-story" href={`/issues/${latest.date}/`}>
              <div>
                <p className="pub-kicker">{latest.date} · DAILY BRIEF</p>
                <h2>{latest.title}</h2>
                <p>{latest.description}</p>
                <span className="text-action">Read the briefing ↗</span>
              </div>
              <div className="editorial-art" aria-hidden="true">
                <span>M / {latest.date.slice(5)}</span>
                <b>
                  Signals
                  <br />
                  into
                  <br />
                  <i>perspective.</i>
                </b>
                <small>THE MUSASHI BRIEFING</small>
              </div>
            </Link>
          ) : (
            <div className="feature-story">
              <div>
                <p className="pub-kicker">A NOTE FROM MUSASHI</p>
                <h2>
                  A home base for
                  <br />
                  what you build next.
                </h2>
                <p>
                  We’re following the ideas, launches, capital, and
                  conversations shaping prediction markets—and asking what they
                  mean for builders.
                </p>
                <Link className="text-action" href="/docs/">
                  Start here ↗
                </Link>
              </div>
              <div className="editorial-art" aria-hidden="true">
                <span>M / FIELD NOTES</span>
                <b>
                  Signals
                  <br />
                  into
                  <br />
                  <i>perspective.</i>
                </b>
                <small>THE MUSASHI BRIEFING</small>
              </div>
            </div>
          )}
        </section>
        <section className="pub-lower">
          <div>
            <div className="pub-section-label">
              <span>THE ARCHIVE</span>
              <Link href="/archive/">Explore ↗</Link>
            </div>
            {issues.length ? (
              issues.slice(0, 4).map((i) => (
                <Link
                  className="issue-row"
                  key={i.date}
                  href={`/issues/${i.date}/`}
                >
                  <time>{i.date}</time>
                  <h3>{i.title}</h3>
                  <p>{i.description}</p>
                </Link>
              ))
            ) : (
              <div className="publication-empty">
                <h3>The first daily edition is on its way.</h3>
                <p>
                  New editions will appear here once Hark’s sourced research is
                  published. In the meantime, explore the builder directories.
                </p>
              </div>
            )}
          </div>
          <aside>
            <div className="pub-section-label">
              <span>ON YOUR RADAR</span>
            </div>
            <Link className="radar-item" href="/investors/">
              <span>01 / CAPITAL</span>
              <h3>Who backs the builders?</h3>
              <p>
                {investors.length} starting points, with evidence of focus or
                investment.
              </p>
            </Link>
            <Link className="radar-item" href="/people/">
              <span>02 / PEOPLE</span>
              <h3>A better reading list.</h3>
              <p>
                Operators and researchers, chosen for the questions they help
                you ask.
              </p>
            </Link>
          </aside>
        </section>
        <section className="pub-signoff">
          <span className="pub-kicker">LESS SCROLLING. MORE CONTEXT.</span>
          <h2>Build with a better view.</h2>
          <a className="pub-button" href="/feed.xml">
            Follow the publication ↗
          </a>
        </section>
      </div>
    </PageFrame>
  );
}
