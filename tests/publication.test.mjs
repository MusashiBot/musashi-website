import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseBrief, importBrief } from "../scripts/import-daily-brief.mjs";
const body =
  "@codex Publish this issue.\n\n## Today in Prediction Markets\nOriginal wording, **unchanged**. [Evidence](https://example.com/1)\n\n## Tradeable on X\nA source-linked observation.\n\n## Build This\nAn idea.\n\n## VC Watch\nA fund.\n\n## Ecosystem & Builder Resources\nA resource.\n\n## Sources\n[Primary source](https://example.com/1)\n";
const issue = {
  title: "Daily brief 2026-11-13: The builder briefing",
  number: 4,
  html_url: "https://github.com/MusashiBot/musashi-website/issues/4",
  user: { login: "VittorioC13" },
  body,
};
test("keeps editorial wording and sources, removes only agent preamble", () => {
  const r = parseBrief(issue);
  assert.ok(r.text.endsWith(body.slice(body.indexOf("##"))));
  assert.ok(!r.text.includes("@codex"));
});
test("rejects master brief, malformed dates, missing sources and unsafe protocols", () => {
  for (const bad of [
    { ...issue, number: 3 },
    { ...issue, title: "Daily brief 2026-02-30: Invalid" },
    { ...issue, body: body.replaceAll("https://", "http://") },
    { ...issue, body: body + "[x](javascript:alert)" },
  ])
    assert.throws(() => parseBrief(bad));
});
test("rejects other repositories and unknown authors", () => {
  assert.throws(() =>
    parseBrief({
      ...issue,
      html_url: "https://github.com/other/repo/issues/4",
    }),
  );
  assert.throws(() => parseBrief({ ...issue, user: { login: "stranger" } }));
});
test("requires the six sections in order", () => {
  assert.throws(() =>
    parseBrief({ ...issue, body: body.replace("## Build This", "## Other") }),
  );
});
test("idempotent import and no silent overwrite", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "musashi-brief-"));
  try {
    assert.equal(importBrief(issue, dir).changed, true);
    assert.equal(importBrief(issue, dir).changed, false);
    assert.throws(() =>
      importBrief({ ...issue, body: body + "Correction" }, dir),
    );
    assert.equal(fs.readdirSync(dir).length, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("long introductory paragraph renders once without losing its ending", async () => {
  const { articlePresentation } = await import(
    "../app/lib/article-presentation.mjs"
  );
  const intro =
    "*" + "Full sourced research. ".repeat(20) + "Keep this last sentence.*";
  const r = articlePresentation(
    "# Title\n\n" + intro + "\n\n## Today in Prediction Markets\nNews",
    "Title",
  );
  assert.equal(r.intro, intro);
  assert.ok(r.intro.includes("Keep this last sentence."));
  assert.ok(!r.body.includes("Full sourced research."));
  assert.ok(r.body.startsWith("## Today"));
});
test("heading-led research remains intact when there is no introduction", async () => {
  const { articlePresentation } = await import(
    "../app/lib/article-presentation.mjs"
  );
  const body = "## Today in Prediction Markets\n\nDetails";
  assert.deepEqual(articlePresentation(body, "Title"), { intro: "", body });
});
