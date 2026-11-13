import fs from "node:fs";
import path from "node:path";

export const VERSION = "1.0.0";
const verdicts = ["relevant", "irrelevant", "uncertain"];
const identityFields = [
  "market_id",
  "url",
  "question",
  "deadline",
  "rules_url",
  "verified_at",
];
const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

export function readJson(file) {
  const stat = fs.statSync(file);
  if (stat.size > 5 * 1024 * 1024)
    throw new Error("Input exceeds 5 MiB. Split the batch.");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writePrivate(file, text) {
  const resolved = path.resolve(file);
  const root = path.resolve("private-batches");
  if (!resolved.startsWith(`${root}${path.sep}`))
    throw new Error("Output must be inside ./private-batches/.");
  let current = path.dirname(resolved);
  while (current.startsWith(root)) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink())
      throw new Error("Private output directories must not be symbolic links.");
    if (current === root) break;
    current = path.dirname(current);
  }
  fs.mkdirSync(path.dirname(resolved), { recursive: true, mode: 0o700 });
  fs.writeFileSync(resolved, text, { flag: "wx", mode: 0o600 });
  return resolved;
}

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function nonempty(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function url(value) {
  if (!nonempty(value) || /\s/.test(value)) return false;
  try {
    const parsed = new URL(value);
    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}
function timestamp(value) {
  if (typeof value !== "string" || !datePattern.test(value)) return false;
  const normalized = value.includes(".") ? value : value.replace("Z", ".000Z");
  try {
    return new Date(value).toISOString() === normalized;
  } catch {
    return false;
  }
}

export function validateBatch(batch, { draft = false } = {}) {
  const errors = [];
  const check = (condition, message) => {
    if (!condition) errors.push(message);
  };
  const keys = (value, expected, at) => {
    if (!object(value)) {
      errors.push(`${at}: expected object`);
      return false;
    }
    check(
      expected.every((key) => Object.hasOwn(value, key)),
      `${at}: missing required fields`,
    );
    check(
      Object.keys(value).every((key) => expected.includes(key)),
      `${at}: unknown fields`,
    );
    return true;
  };
  if (
    !keys(
      batch,
      ["schema_version", "batch_id", "reviewed_at", "retrospective", "items"],
      "batch",
    )
  )
    return errors;
  check(
    batch.schema_version === VERSION,
    "batch.schema_version: expected 1.0.0",
  );
  check(
    nonempty(batch.batch_id) && batch.batch_id.length <= 120,
    "batch.batch_id: expected nonempty string, max 120 characters",
  );
  check(
    timestamp(batch.reviewed_at) || (draft && batch.reviewed_at === null),
    "batch.reviewed_at: review timestamp required; use --draft only for incomplete work",
  );
  check(
    typeof batch.retrospective === "boolean",
    "batch.retrospective: expected boolean",
  );
  check(
    Array.isArray(batch.items) &&
      batch.items.length >= 1 &&
      batch.items.length <= 100,
    "batch.items: expected 1–100 inputs",
  );
  if (!Array.isArray(batch.items)) return errors;
  const seen = new Set();
  batch.items.forEach((item, index) => {
    const at = `items[${index}]`;
    if (!keys(item, ["id", "input", "candidates"], at)) return;
    check(
      nonempty(item.id) && item.id.length <= 120 && !seen.has(item.id),
      `${at}.id: expected unique nonempty ID, max 120 characters`,
    );
    seen.add(item.id);
    if (
      keys(
        item.input,
        ["text", "source_url", "source_published_at"],
        `${at}.input`,
      )
    ) {
      check(
        nonempty(item.input.text) && item.input.text.length <= 10000,
        `${at}.input.text: expected 1–10000 characters`,
      );
      check(
        item.input.source_url === null || url(item.input.source_url),
        `${at}.input.source_url: expected HTTP(S) URL or null`,
      );
      check(
        item.input.source_published_at === null ||
          timestamp(item.input.source_published_at),
        `${at}.input.source_published_at: expected UTC timestamp or null`,
      );
      if (
        timestamp(batch.reviewed_at) &&
        timestamp(item.input.source_published_at)
      )
        check(
          Date.parse(item.input.source_published_at) <=
            Date.parse(batch.reviewed_at),
          `${at}: publication occurs after review`,
        );
    }
    check(
      Array.isArray(item.candidates) &&
        item.candidates.length >= 1 &&
        item.candidates.length <= 3,
      `${at}.candidates: expected 1–3 candidates`,
    );
    if (!Array.isArray(item.candidates)) return;
    const seenCandidates = new Set();
    item.candidates.forEach((candidate, candidateIndex) => {
      const cat = `${at}.candidates[${candidateIndex}]`;
      if (
        !keys(
          candidate,
          [
            "venue",
            ...identityFields,
            "decision",
            "reason",
            "evidence",
            "missing_information",
          ],
          cat,
        )
      )
        return;
      check(
        ["polymarket", "kalshi"].includes(candidate.venue),
        `${cat}.venue: unsupported venue`,
      );
      check(
        verdicts.includes(candidate.decision),
        `${cat}.decision: unsupported verdict`,
      );
      for (const field of identityFields) {
        const value = candidate[field];
        const valid =
          field.endsWith("_at") || field === "deadline"
            ? timestamp(value)
            : field === "url" || field === "rules_url"
              ? url(value)
              : nonempty(value);
        check(value === null || valid, `${cat}.${field}: invalid value`);
      }
      if (nonempty(candidate.market_id)) {
        const key = `${candidate.venue}:${candidate.market_id}`;
        check(!seenCandidates.has(key), `${cat}: duplicate candidate market`);
        seenCandidates.add(key);
      }
      check(
        nonempty(candidate.reason) && candidate.reason.length <= 10000,
        `${cat}.reason: expected 1–10000 characters`,
      );
      check(
        Array.isArray(candidate.missing_information) &&
          candidate.missing_information.every(nonempty),
        `${cat}.missing_information: expected array of nonempty strings`,
      );
      check(
        Array.isArray(candidate.evidence),
        `${cat}.evidence: expected array`,
      );
      if (Array.isArray(candidate.evidence))
        candidate.evidence.forEach((entry, evidenceIndex) => {
          if (
            keys(entry, ["url", "note"], `${cat}.evidence[${evidenceIndex}]`)
          ) {
            check(
              url(entry.url),
              `${cat}.evidence[${evidenceIndex}].url: expected HTTP(S) URL`,
            );
            check(
              nonempty(entry.note),
              `${cat}.evidence[${evidenceIndex}].note: expected evidence description`,
            );
          }
        });
      if (candidate.decision !== "uncertain") {
        check(
          identityFields.every((field) => candidate[field] !== null),
          `${cat}: classified matches require complete verified contract identity`,
        );
        check(
          url(item.input?.source_url),
          `${cat}: classified matches require an input source URL`,
        );
        check(
          Array.isArray(candidate.evidence) && candidate.evidence.length > 0,
          `${cat}: classified matches require evidence`,
        );
      } else {
        check(
          Array.isArray(candidate.missing_information) &&
            candidate.missing_information.length > 0,
          `${cat}: uncertain verdict requires explicit missing information`,
        );
      }
      if (timestamp(batch.reviewed_at) && timestamp(candidate.verified_at))
        check(
          Date.parse(candidate.verified_at) <= Date.parse(batch.reviewed_at),
          `${cat}: contract verification occurs after review`,
        );
    });
  });
  return errors;
}

export function draftBatch(submission) {
  if (
    !object(submission) ||
    !nonempty(submission.batch_id) ||
    typeof submission.retrospective !== "boolean" ||
    !Array.isArray(submission.items)
  )
    throw new Error(
      "Submission needs batch_id, retrospective and items. See submission-template.json.",
    );
  const draft = {
    schema_version: VERSION,
    batch_id: submission.batch_id,
    reviewed_at: null,
    retrospective: submission.retrospective,
    items: submission.items.map((item) => ({
      id: item.id,
      input: item.input,
      candidates: (item.candidates ?? []).map((candidate) => ({
        venue: candidate.venue,
        market_id: candidate.market_id ?? null,
        url: candidate.url ?? null,
        question: candidate.question ?? null,
        deadline: null,
        rules_url: null,
        verified_at: null,
        decision: "uncertain",
        reason:
          "Not reviewed. Verify the source and exact contract before making a decision.",
        evidence: [],
        missing_information: [
          "Source and contract verification pending; this is a draft, not a delivered review.",
        ],
      })),
    })),
  };
  const errors = validateBatch(draft, { draft: true });
  if (errors.length) throw new Error(errors.join("\n"));
  return draft;
}

export function renderMarkdown(batch) {
  const escape = (value) =>
    String(value)
      .replace(/[\\`*_{}[\]<>#|]/g, "\\$&")
      .replace(/\r?\n/g, " ");
  const link = (value) =>
    value ? `<${value.replaceAll(">", "%3E")}>` : "Not supplied";
  return [
    `# Musashi Match — ${escape(batch.batch_id)}`,
    "",
    `Schema: ${VERSION} · Reviewed: ${batch.reviewed_at ?? "DRAFT"}`,
    "",
    batch.retrospective
      ? "**Retrospective review. This is not a point-in-time backtest.**"
      : "**Reviewed against the sources available at the recorded review time.**",
    "",
    ...batch.items.flatMap((item) => [
      `## ${escape(item.id)}`,
      "",
      escape(item.input.text),
      "",
      `Source: ${link(item.input.source_url)}`,
      `Published: ${item.input.source_published_at ?? "Unknown"}`,
      "",
      ...item.candidates.flatMap((candidate) => [
        `### ${candidate.decision.toUpperCase()} — ${escape(candidate.question ?? "Unavailable contract")}`,
        "",
        `Venue: ${candidate.venue} · Market ID: ${escape(candidate.market_id ?? "Unknown")}`,
        `Market: ${link(candidate.url)}`,
        `Venue end date (metadata): ${candidate.deadline ?? "Unknown"} · Verified: ${candidate.verified_at ?? "Not verified"}`,
        `Rules: ${link(candidate.rules_url)}`,
        "",
        escape(candidate.reason),
        "",
        ...candidate.evidence.map(
          (entry) => `- ${link(entry.url)} — ${escape(entry.note)}`,
        ),
        ...candidate.missing_information.map(
          (entry) => `- Missing: ${escape(entry)}`,
        ),
        "",
      ]),
    ]),
    "Reviewed relevance is not a trading recommendation or a promise about market movements.",
    "",
  ].join("\n");
}

export function parseArgs(argv, required) {
  if (argv.includes("--help")) return null;
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--draft") {
      options.draft = true;
      continue;
    }
    if (
      !["--input", "--output"].includes(key) ||
      !argv[index + 1] ||
      argv[index + 1].startsWith("--") ||
      Object.hasOwn(options, key.slice(2))
    )
      throw new Error(`Unexpected or incomplete argument: ${key}`);
    options[key.slice(2)] = argv[++index];
  }
  for (const field of required)
    if (!options[field]) throw new Error(`Missing --${field}. Use --help.`);
  return options;
}
