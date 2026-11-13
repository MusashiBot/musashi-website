"use client";

import { useEffect, useState } from "react";
import {
  examples,
  sampleLabels,
  type Decision,
  type ReviewItem,
} from "../lib/reviews";

const verdict: Record<Decision, string> = {
  relevant: "Good match",
  irrelevant: "Wrong match",
  uncertain: "Needs more evidence",
};
function date(value: string | null) {
  return value
    ? value.replace("T", " ").replace("Z", " UTC")
    : "Not supplied / not verified";
}
function Detail({ item }: { item: ReviewItem }) {
  const candidate = item.candidates[0];
  const label = sampleLabels[item.id];
  return (
    <article className="sample-detail" aria-labelledby="detail-title">
      <div className="sample-title">
        <h2 id="detail-title">{label.title}</h2>
        <span className={`decision ${candidate.decision}`}>
          {verdict[candidate.decision]}
        </span>
      </div>
      {label.kind === "Incomplete-input demonstration" && (
        <p className="notice">
          This example deliberately withholds information. It does not mean the
          real market is unavailable.
        </p>
      )}
      <div className="evidence-grid">
        <section className="evidence-pane">
          <h3>The headline or input</h3>
          <p>{item.input.text}</p>
          {item.input.source_url ? (
            <a
              href={item.input.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="small"
            >
              Read the source ↗
            </a>
          ) : (
            <span className="small muted">No source supplied</span>
          )}
        </section>
        <section className="evidence-pane">
          <h3>The selected market</h3>
          <p>{candidate.question ?? "No identifiable market supplied"}</p>
          {candidate.url && (
            <a
              href={candidate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="small"
            >
              Open the market ↗
            </a>
          )}
        </section>
      </div>
      <section className="review-reason">
        <h3>Our review</h3>
        <p>{candidate.reason}</p>
        {candidate.missing_information.length > 0 && (
          <>
            <h3>What we’d need to know</h3>
            <ul>
              {candidate.missing_information.map((info) => (
                <li key={info}>{info}</li>
              ))}
            </ul>
          </>
        )}
      </section>
      <details className="review-evidence">
        <summary>Sources and contract details</summary>
        <dl className="contract-metadata">
          <dt>Venue / market ID</dt>
          <dd>
            {candidate.venue} / {candidate.market_id ?? "Unknown"}
          </dd>
          <dt>Source publication time</dt>
          <dd>{date(item.input.source_published_at)}</dd>
          <dt>Venue end date (metadata)</dt>
          <dd>{date(candidate.deadline)}</dd>
          <dt>Rules source</dt>
          <dd>
            {candidate.rules_url ? (
              <a
                href={candidate.rules_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Venue record ↗
              </a>
            ) : (
              "Not supplied"
            )}
          </dd>
          <dt>Contract checked</dt>
          <dd>{date(candidate.verified_at)}</dd>
          <dt>Batch reviewed</dt>
          <dd>{date(examples.reviewed_at)}</dd>
        </dl>
        <ul>
          {candidate.evidence.map((e, i) => (
            <li key={`${e.url}-${i}`}>
              <a href={e.url} target="_blank" rel="noopener noreferrer">
                Source {i + 1} ↗
              </a>{" "}
              — {e.note}
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}
export default function SampleExplorer() {
  const [selected, setSelected] = useState(examples.items[0].id);
  useEffect(() => {
    function selectFromHash() {
      const id = window.location.hash.slice(1);
      if (examples.items.some((item) => item.id === id)) setSelected(id);
    }
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, []);
  const item =
    examples.items.find((item) => item.id === selected) ?? examples.items[0];
  return (
    <div className="example-viewer">
      <label htmlFor="example-choice">Choose an example</label>
      <select
        id="example-choice"
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
      >
        {examples.items.map((item) => (
          <option key={item.id} value={item.id}>
            {verdict[item.candidates[0].decision]} —{" "}
            {sampleLabels[item.id].title}
          </option>
        ))}
      </select>
      <Detail item={item} />
    </div>
  );
}
