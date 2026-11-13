import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  draftBatch,
  parseArgs,
  renderMarkdown,
  validateBatch,
  writePrivate,
} from "../scripts/match-lib.mjs";

function reviewed() {
  return {
    schema_version: "1.0.0",
    batch_id: "test-batch",
    reviewed_at: "2026-11-01T10:00:00Z",
    retrospective: true,
    items: [
      {
        id: "case-1",
        input: {
          text: "A source summary.",
          source_url: "https://www.federalreserve.gov/example",
          source_published_at: "2026-10-01T12:00:00Z",
        },
        candidates: [
          {
            venue: "kalshi",
            market_id: "test-only-fixture",
            url: "https://kalshi.com/markets/test-fixture",
            question: "Test fixture question?",
            deadline: "2026-12-01T00:00:00Z",
            rules_url: "https://kalshi.com/markets/test-fixture",
            verified_at: "2026-11-01T09:00:00Z",
            decision: "relevant",
            reason:
              "Fixture rationale; these test-only URLs are not public examples.",
            evidence: [
              {
                url: "https://www.federalreserve.gov/example",
                note: "Fixture source.",
              },
            ],
            missing_information: [],
          },
        ],
      },
    ],
  };
}
function candidate(batch) {
  return batch.items[0].candidates[0];
}

test("complete finalized batch and Markdown render", () => {
  const batch = reviewed();
  assert.deepEqual(validateBatch(batch), []);
  const markdown = renderMarkdown(batch);
  assert.match(markdown, /Retrospective review/);
  assert.match(markdown, /RELEVANT/);
  assert.match(markdown, /Venue end date \(metadata\): 2026-12-01/);
});

test("init creates uncertain draft without inferring contract facts", () => {
  const submission = JSON.parse(
    fs.readFileSync(
      new URL("../public/downloads/submission-template.json", import.meta.url),
    ),
  );
  const draft = draftBatch(submission);
  assert.equal(draft.reviewed_at, null);
  assert.equal(candidate(draft).decision, "uncertain");
  assert.equal(candidate(draft).deadline, null);
  assert.deepEqual(validateBatch(draft, { draft: true }), []);
  assert.ok(
    validateBatch(draft).some((error) =>
      error.includes("review timestamp required"),
    ),
  );
});

test("missing contract rules cannot be a classified match", () => {
  const batch = reviewed();
  candidate(batch).rules_url = null;
  assert.ok(
    validateBatch(batch).some((error) =>
      error.includes("complete verified contract identity"),
    ),
  );
});

test("unavailable contract can only be uncertain with missing evidence recorded", () => {
  const batch = reviewed();
  Object.assign(candidate(batch), {
    market_id: null,
    url: null,
    question: null,
    deadline: null,
    rules_url: null,
    verified_at: null,
    decision: "uncertain",
    reason: "The supplied market cannot be verified.",
    evidence: [],
    missing_information: ["Exact contract identity and rules unavailable."],
  });
  assert.deepEqual(validateBatch(batch), []);
  candidate(batch).missing_information = [];
  assert.ok(
    validateBatch(batch).some((error) =>
      error.includes("explicit missing information"),
    ),
  );
});

test("rejects arbitrary verdicts, unsupported venues and unknown fields", () => {
  const batch = reviewed();
  Object.assign(candidate(batch), {
    venue: "invented",
    decision: "buy",
    confidence: 99,
  });
  const errors = validateBatch(batch).join("\n");
  assert.match(errors, /unsupported venue/);
  assert.match(errors, /unsupported verdict/);
  assert.match(errors, /unknown fields/);
});

test("rejects unsafe links, credentials, and untraceable classified decisions", () => {
  const batch = reviewed();
  batch.items[0].input.source_url = null;
  candidate(batch).url = "javascript:alert(1)";
  candidate(batch).rules_url = "https://secret:token@example.com/rules";
  candidate(batch).evidence = [];
  const errors = validateBatch(batch).join("\n");
  assert.match(errors, /url: invalid value/);
  assert.match(errors, /rules_url: invalid value/);
  assert.match(errors, /input source URL/);
  assert.match(errors, /require evidence/);
});

test("rejects invalid dates and post-review publication/verification", () => {
  const batch = reviewed();
  candidate(batch).deadline = "2026-02-31T00:00:00Z";
  candidate(batch).verified_at = "2026-11-02T00:00:00Z";
  batch.items[0].input.source_published_at = "2026-11-03T00:00:00Z";
  const errors = validateBatch(batch).join("\n");
  assert.match(errors, /deadline: invalid value/);
  assert.match(errors, /publication occurs after review/);
  assert.match(errors, /verification occurs after review/);
});

test("rejects duplicate input IDs, duplicate candidate markets, and more than three candidates", () => {
  const batch = reviewed();
  batch.items.push(structuredClone(batch.items[0]));
  candidate(batch).decision = "irrelevant";
  batch.items[0].candidates = Array.from({ length: 4 }, () =>
    structuredClone(candidate(batch)),
  );
  const errors = validateBatch(batch).join("\n");
  assert.match(errors, /unique nonempty ID/);
  assert.match(errors, /1–3 candidates/);
  assert.match(errors, /duplicate candidate market/);
});

test("refuses public or traversed output locations", () => {
  assert.throws(() => writePrivate("public/leak.json", "{}"), /inside/);
  assert.throws(
    () => writePrivate("private-batches/../public/leak.json", "{}"),
    /inside/,
  );
});

test("markdown escapes supplied content instead of embedding HTML", () => {
  const batch = reviewed();
  batch.items[0].input.text = "<script>alert(1)</script>\n# untrusted";
  assert.doesNotMatch(renderMarkdown(batch), /^<script>/m);
  assert.match(renderMarkdown(batch), /\\<script\\>/);
});

test("CLI parsing requires explicit paths and rejects ambiguous options", () => {
  assert.equal(parseArgs(["--help"], ["input"]), null);
  assert.throws(() => parseArgs(["--input"], ["input"]), /incomplete/);
  assert.throws(
    () => parseArgs(["--input", "a", "--input", "b"], ["input"]),
    /Unexpected/,
  );
});

test("public schema exposes version, nullable draft review time and strict properties", () => {
  const schema = JSON.parse(
    fs.readFileSync(
      new URL("../public/downloads/review-batch.schema.json", import.meta.url),
    ),
  );
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema_version.const, "1.0.0");
  assert.equal(schema.properties.items.items.properties.candidates.maxItems, 3);
});
