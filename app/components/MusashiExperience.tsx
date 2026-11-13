import HeroSignalReceipt from "./HeroSignalReceipt";

export default function MusashiExperience() {
  return (
    <>
      <section className="landing-hero shell signal-hero" id="extension">
        <div className="landing-copy">
          <p className="eyebrow">The prediction-market extension for X</p>
          <h1>
            Polymarket,
            <br />
            <span>under the post.</span>
          </h1>
          <p className="hero-description">
            Read a post. Find the related market.
            <br />
            Keep a receipt of what caught your eye.
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href="https://chromewebstore.google.com/detail/musashi/jjnfhhfdfeglfncccjjpojbnngodaepk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Chrome <span aria-hidden="true">↗</span>
            </a>
            <a
              className="quiet-link"
              href="https://github.com/MusashiBot/musashi-extension"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </div>
          <p className="hero-status">Available on the Chrome Web Store.</p>
        </div>
        <div
          className="receipt-object"
          id="receipt"
          aria-label="Supplied sample signal receipt"
        >
          <div className="floating-paper">
            <div className="printer-slot" aria-hidden="true" />
            <HeroSignalReceipt />
          </div>
          <p className="object-caption signal-sample-caption">
            Shortened sample · illustrative figures
          </p>
        </div>
      </section>
      <section className="next-section shell" id="next">
        <div>
          <p className="eyebrow">An idea we’re exploring</p>
          <h2>
            Your interests.
            <br />
            An agent. A receipt.
          </h2>
        </div>
        <div className="next-copy">
          <p>
            Could an agent follow the topics you care about, find related
            markets, and account for every action in a daily receipt?
          </p>
          <details>
            <summary>Where does automated trading fit?</summary>
            <p>
              Agent-assisted research and trading are future experiments. The
              existing extension links posts to markets. Automated trading and
              daily receipt delivery are not implemented in this preview.
            </p>
          </details>
          <a
            className="quiet-link"
            href="https://calendly.com/victorche"
            target="_blank"
            rel="noopener noreferrer"
          >
            Talk about it with Victor ↗
          </a>
        </div>
      </section>
    </>
  );
}
