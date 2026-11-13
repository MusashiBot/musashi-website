"use client";

import { useId, useState } from "react";
import demo from "../../public/downloads/musashi-feed-demo.json";

export default function FeedDemo({
  initialTopic = "Policy",
}: {
  initialTopic?: string;
}) {
  const [selected, setSelected] = useState(() =>
    Math.max(
      0,
      demo.records.findIndex((record) => record.topic === initialTopic),
    ),
  );
  const [json, setJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const panelId = useId();
  const record = demo.records[selected];
  const output = JSON.stringify(
    { demo: true, schema_version: demo.schema_version, ...record },
    null,
    2,
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
      setCopied(false);
    }
  }
  return (
    <div className="feed-window">
      <div className="feed-window-bar">
        <span>
          <span className="window-mark" aria-hidden="true">
            ↗
          </span>{" "}
          Musashi <span className="window-divider">/</span> Feed preview
        </span>
        <span className="preview-badge">Interactive demo</span>
      </div>
      <div className="feed-workspace">
        <div className="feed-inbox">
          <div className="pane-label">
            EXAMPLE INPUTS <span>03</span>
          </div>
          <div
            className="story-list"
            role="group"
            aria-label="Select an illustrative story"
          >
            {demo.records.map((item, index) => (
              <button
                key={item.id}
                className={`story-button ${selected === index ? "selected" : ""}`}
                aria-pressed={selected === index}
                aria-controls={panelId}
                onClick={() => {
                  setSelected(index);
                  setCopied(false);
                  setCopyFailed(false);
                }}
              >
                <span className="story-topic">
                  {item.topic}
                  <span aria-hidden="true">↗</span>
                </span>
                <span className="story-headline">{item.source.text}</span>
                <span className="story-origin">
                  {item.source.kind === "social_post"
                    ? "Social post"
                    : "News headline"}{" "}
                  · example
                </span>
              </button>
            ))}
          </div>
        </div>
        <section
          className="feed-result"
          id={panelId}
          aria-label="Selected story output"
        >
          <div className="result-toolbar">
            <span className="pane-label">PROPOSED OUTPUT</span>
            <div className="view-switch" role="group" aria-label="Output view">
              <button aria-pressed={!json} onClick={() => setJson(false)}>
                Preview
              </button>
              <button aria-pressed={json} onClick={() => setJson(true)}>
                JSON
              </button>
            </div>
          </div>
          {json ? (
            <div className="json-view">
              <div className="json-file">
                {record.id}.json
                <button onClick={copy}>
                  {copied ? "Copied ✓" : "Copy JSON"}
                </button>
              </div>
              <pre tabIndex={0} aria-label="Illustrative JSON output">
                {output}
              </pre>
              <p className="copy-status" role="status">
                {copyFailed
                  ? "Clipboard unavailable. Select the JSON to copy it."
                  : copied
                    ? "Illustrative JSON copied."
                    : "Proposed format · not a live API response"}
              </p>
            </div>
          ) : (
            <div className="record-preview">
              <div className="record-origin">{record.source.label}</div>
              <h2>{record.source.text}</h2>
              <div className="match-list-label">
                Related markets <span>02</span>
              </div>
              <div className="market-records">
                {record.related_markets.map((market) => (
                  <article className="market-record" key={market.venue}>
                    <div className="market-record-meta">
                      <span
                        className={`venue-name venue-${market.venue.toLowerCase()}`}
                      >
                        {market.venue}
                      </span>
                      <span className="relationship">
                        {market.relationship === "direct"
                          ? "Direct relevance"
                          : "Related context"}
                      </span>
                    </div>
                    <h3>{market.question}</h3>
                    <p>{market.context}</p>
                  </article>
                ))}
              </div>
              <p className="record-caveat">
                <span aria-hidden="true">↳</span> {record.caveat}
              </p>
            </div>
          )}
        </section>
      </div>
      <div className="feed-window-footer">
        <span>Source → Market → Context</span>
        <a href="/downloads/musashi-feed-demo.json" download>
          Download demo JSON <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  );
}
