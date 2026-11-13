import Link from "next/link";
import PageFrame from "../components/PageFrame";
import { createPageMetadata } from "../lib/seo";
export const metadata = createPageMetadata({
  title: "Privacy",
  description:
    "Privacy for the Musashi extension and daily-receipt website preview.",
  path: "/privacy/",
});
export default function Privacy() {
  return (
    <PageFrame>
      <div className="shell">
        <div className="page-intro">
          <p className="eyebrow">Effective November 13, 2026</p>
          <h1>
            Your feed.
            <br />
            Your information.
          </h1>
          <p>
            This policy covers the current Musashi website preview. The{" "}
            <Link href="/privacy/legacy-extension/" className="text-link">
              historical extension policy
            </Link>{" "}
            is archived separately.
          </p>
        </div>
        <div className="prose">
          <h2>The website</h2>
          <p>
            This static site presents the extension idea and an illustrative
            sample receipt. It does not read your X account, connect a wallet,
            fetch trading activity, or place orders. The sample receipt is
            bundled with the site; it contains no personal trading data
            collected from visitors.
          </p>
          <h2>Website delivery</h2>
          <p>
            We do not operate sign-ins, upload forms, advertising trackers, or
            website analytics. Our hosting provider may process IP addresses and
            request logs to deliver and secure the site. Fonts and assets are
            served with the website.
          </p>
          <h2>External links and conversations</h2>
          <p>
            Links to source publications, X, GitHub, Chrome Web Store, and
            Calendly open those services, whose privacy practices apply.
            Information you choose to send Victor is used to respond to your
            message. Any future extension or agent service will need its own
            current data-handling terms before launch.
          </p>
          <h2>Questions</h2>
          <p>
            Contact{" "}
            <a
              href="https://x.com/RotcivWho"
              target="_blank"
              rel="noopener noreferrer"
            >
              @RotcivWho on X
            </a>
            .
          </p>
        </div>
      </div>
    </PageFrame>
  );
}
