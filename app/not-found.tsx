import Link from "next/link";
import PageFrame from "./components/PageFrame";

export default function NotFound() {
  return (
    <PageFrame>
      <div className="shell section">
        <span className="eyebrow">404 / PAGE NOT FOUND</span>
        <h1 style={{ fontSize: "clamp(40px,6vw,70px)", margin: "20px 0" }}>
          No match for this page.
        </h1>
        <p>
          This address doesn’t exist. Some previous Musashi products have been
          retired.
        </p>
        <div className="button-row">
          <Link href="/" className="button button-primary">
            Back to Musashi →
          </Link>
          <Link href="/retired/" className="text-link">
            Previous products
          </Link>
        </div>
      </div>
    </PageFrame>
  );
}
