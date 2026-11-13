import Link from "next/link";
import PageFrame from "../components/PageFrame";
import { createPageMetadata } from "../lib/seo";
export const metadata = createPageMetadata({
  title: "About Musashi",
  description:
    "Independent research and resources for prediction-market builders.",
  path: "/docs/",
});
export default function About() {
  return (
    <PageFrame>
      <article className="edition">
        <header>
          <p className="pub-kicker">START HERE</p>
          <h1>A home base for prediction-market builders.</h1>
          <p className="edition-dek">
            Musashi follows the ideas, launches, people, and capital that could
            shape what you build next.
          </p>
        </header>
        <div className="edition-body">
          <h2>What you’ll find</h2>
          <p>
            Each daily briefing covers prediction-market developments, events on
            X, startup ideas, venture activity, and builder resources. Every
            edition keeps its source links.
          </p>
          <h2>How the publication works</h2>
          <p>
            Hark prepares sourced research in GitHub. Codex formats it for the
            publication, checks the build, and ships website updates. Hark’s
            research remains attributed, with original GitHub issues linked from
            each edition.
          </p>
          <p>
            The archive grows with each published daily briefing.
          </p>
          <h2>Directories that grow with the research</h2>
          <p>
            Start with the <Link href="/investors/">investor directory</Link>{" "}
            and <Link href="/people/">people watchlist</Link>. We distinguish
            documented facts from editorial judgment. An investment is evidence
            of an investor’s interest; it is not proof that they are currently
            accepting pitches.
          </p>
          <h2>The extension is still here</h2>
          <p>
            The <Link href="/extension/">Musashi extension</Link> has its own
            page and official Chrome Web Store download. Daily receipts and
            agent-assisted trading remain concepts; this publication does not
            implement those features or restore the retired matching backend.
          </p>
          <h2>Follow Musashi</h2>
          <p>
            <a href="/feed.xml">Subscribe via RSS</a> or follow{" "}
            <a href="https://x.com/RotcivWho">@RotcivWho</a>. Email
            subscriptions are not enabled. For corrections, contact Victor on X.
          </p>
        </div>
      </article>
    </PageFrame>
  );
}
