"use client";

import { useState } from "react";
import FeedDemo from "./FeedDemo";
import demo from "../../public/downloads/musashi-feed-demo.json";

export default function EvolutionDemo() {
  const [view, setView] = useState<"extension" | "feed">("feed");
  const [replay, setReplay] = useState(0);
  const story = demo.records[2];
  function choose(next: "extension" | "feed") {
    setView(next);
    setReplay((n) => n + 1);
  }
  return (
    <section
      className="shell evolution-section"
      id="evolution"
      aria-label="From existing extension to proposed B2B feed"
    >
      <div className="evolution-heading">
        <div>
          <p className="eyebrow">The next chapter of Musashi</p>
          <h2>
            Same matching job.
            <br />
            <em>A different customer.</em>
          </h2>
        </div>
        <p>
          Explore what we built,
          <br />
          then where we want to take it.
        </p>
      </div>
      <div
        className="evolution-track"
        role="group"
        aria-label="Explore Musashi’s evolution"
      >
        <button
          className={`evolution-step ${view === "extension" ? "active" : ""}`}
          aria-pressed={view === "extension"}
          aria-controls="evolution-preview"
          onClick={() => choose("extension")}
        >
          <span className="step-top">
            <span>01 / EXISTING CODE</span>
            <span className="stage-pill">Built</span>
          </span>
          <span className="step-body">
            <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect x="5" y="8" width="38" height="32" rx="4" />
              <path d="M5 17h38M12 12h1m4 0h1m4 0h1M13 25h22m-22 7h14" />
            </svg>
            <span>
              <strong>The X extension</strong>
              <small>Tweet → market card</small>
            </span>
          </span>
          <span className="step-select">
            Explore the original <span aria-hidden="true">↗</span>
          </span>
        </button>
        <div className="evolution-connector" aria-hidden="true" key={replay}>
          <svg viewBox="0 0 120 40" fill="none">
            <path className="connector-base" d="M0 20h112m-9-9 10 9-10 9" />
            <path className="connector-travel" d="M0 20h112" />
          </svg>
          <span>New delivery</span>
        </div>
        <button
          className={`evolution-step future ${view === "feed" ? "active" : ""}`}
          aria-pressed={view === "feed"}
          aria-controls="evolution-preview"
          onClick={() => choose("feed")}
        >
          <span className="step-top">
            <span>02 / PROPOSED B2B FEED</span>
            <span className="stage-pill">Exploring</span>
          </span>
          <span className="step-body">
            <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M17 9h-4v12l-5 3 5 3v12h4m14-30h4v12l5 3-5 3v12h-4M21 18h6m-6 6h6m-6 6h6" />
            </svg>
            <span>
              <strong>A feed for agents</strong>
              <small>Post → JSON → your software</small>
            </span>
          </span>
          <span className="step-select">
            Explore the concept <span aria-hidden="true">↗</span>
          </span>
        </button>
      </div>
      <div className="evolution-preview" id="evolution-preview">
        <div className="preview-context">
          <span>
            {view === "extension"
              ? "Existing extension · UI reconstruction"
              : "Proposed feed · interactive concept"}
          </span>
          <button onClick={() => setReplay((n) => n + 1)}>
            Replay transition <span aria-hidden="true">↻</span>
          </button>
        </div>
        <div className="evolution-stage" id="demo" key={`${view}-${replay}`}>
          {view === "extension" ? (
            <div className="extension-recreation">
              <div className="browser-chrome">
                <span className="browser-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span>x.com / Home</span>
                <span className="preview-badge">
                  Illustrative reconstruction
                </span>
              </div>
              <div className="extension-canvas">
                <div className="tweet-recreation">
                  <div className="mock-author">
                    <span className="mock-avatar" aria-hidden="true">
                      ↗
                    </span>
                    <span>
                      Example sports post<small>Fictional scenario</small>
                    </span>
                    <span className="mock-x" aria-hidden="true">
                      𝕏
                    </span>
                  </div>
                  <p className="mock-post">{story.source.text}</p>
                  <div className="extension-injection">
                    <span className="injection-rule" aria-hidden="true" />
                    <div className="injection-caption">
                      <span>↳ MUSASHI MATCH</span>
                      <span>Injected under the tweet</span>
                    </div>
                    <article className="original-market-card">
                      <div>
                        <span className="venue-name">Polymarket</span>
                        <span className="market-card-mark" aria-hidden="true">
                          ↗
                        </span>
                      </div>
                      <h3>{story.related_markets[0].question}</h3>
                      <div className="mock-match-tags">
                        <span>Seattle</span>
                        <span>Football</span>
                        <span>Lineup news</span>
                      </div>
                    </article>
                  </div>
                  <div className="extension-caption">
                    <span>For a person reading X</span>
                    <span>Tweet text → matching API → card</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <FeedDemo initialTopic="Sports" />
          )}
        </div>
        <div className="evolution-footnote">
          {view === "extension" ? (
            <>
              <span>
                Extension code exists; its matching backend is paused. This is a
                recreated interface with fictional data.
              </span>
              <a
                href="https://github.com/MusashiBot/musashi-extension"
                target="_blank"
                rel="noopener noreferrer"
              >
                View extension source ↗
              </a>
            </>
          ) : (
            <>
              <span>
                Fictional headlines and contracts. The B2B feed is proposed, not
                live.
              </span>
              <a
                href="https://github.com/MusashiBot/musashi-extension"
                target="_blank"
                rel="noopener noreferrer"
              >
                See where it started ↗
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
