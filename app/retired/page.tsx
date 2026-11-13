import Link from "next/link";
import PageFrame from "../components/PageFrame";
import { createPageMetadata } from "../lib/seo";
export const metadata = createPageMetadata({
  title: "Previous Musashi products",
  description:
    "Status of earlier Musashi APIs, arbitrage pages, and B2B pilot offers.",
  path: "/retired/",
  noIndex: true,
});
export default function Retired() {
  return (
    <PageFrame>
      <div className="shell">
        <div className="page-intro">
          <p className="eyebrow">Product direction / November 2026</p>
          <h1>Back to the original connection.</h1>
          <p>
            Musashi is returning to its X-to-prediction-market extension idea,
            with a daily receipt concept.
          </p>
        </div>
        <div className="prose">
          <h2>Previous offers</h2>
          <p>
            The earlier arbitrage scanner, public API, Agent SDK, hosted MCP
            offering, and B2B sample-review package are no longer promoted or
            supported as current products. Old endpoints and installation
            commands may be obsolete.
          </p>
          <h2>Extension status</h2>
          <p>
            The extension source remains available. A working matching backend
            is required; the current website is an interactive preview, not a
            relaunched hosted extension service. Receipt delivery and autonomous
            trading are not implemented.
          </p>
          <p>
            <Link href="/">Explore the new direction →</Link>
          </p>
          <p>
            <Link href="/privacy/legacy-extension/">
              Historical extension privacy policy →
            </Link>
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
