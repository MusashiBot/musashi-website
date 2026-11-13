import Link from "next/link";
export default function Header() {
  return (
    <header className="site-header publication-header">
      <div className="shell header-inner">
        <Link className="publication-logo" href="/" aria-label="Musashi home">
          Musashi<span>FOR THE BUILDERS</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/archive/">Briefings</Link>
          <Link href="/investors/">Investors</Link>
          <Link href="/people/">People</Link>
          <Link href="/extension/">Extension ↗</Link>
          <a className="publication-subscribe" href="/feed.xml">
            Subscribe via RSS
          </a>
        </nav>
      </div>
    </header>
  );
}
