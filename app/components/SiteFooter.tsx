import Link from "next/link";
export default function SiteFooter() {
  return (
    <footer className="site-footer shell publication-footer">
      <div>
        <strong>Musashi</strong>
        <p>The daily briefing for prediction-market builders.</p>
      </div>
      <nav aria-label="Footer">
        <Link href="/docs/">About</Link>
        <Link href="/privacy/">Privacy</Link>
        <a href="/feed.xml">RSS</a>
        <a
          href="https://x.com/RotcivWho"
          target="_blank"
          rel="noopener noreferrer"
        >
          @RotcivWho ↗
        </a>
      </nav>
    </footer>
  );
}
