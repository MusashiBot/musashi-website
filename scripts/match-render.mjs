#!/usr/bin/env node
import {
  parseArgs,
  readJson,
  renderMarkdown,
  validateBatch,
  writePrivate,
} from "./match-lib.mjs";
try {
  const args = parseArgs(process.argv.slice(2), ["input", "output"]);
  if (!args)
    console.log(
      "Usage: node scripts/match-render.mjs --input reviewed.json --output private-batches/customer/review.md\nRenders a finalized batch as Markdown. Never overwrites files. No network calls.",
    );
  else {
    const batch = readJson(args.input);
    const errors = validateBatch(batch);
    if (errors.length) throw new Error(errors.join("\n"));
    console.log(
      `Review rendered: ${writePrivate(args.output, renderMarkdown(batch))}`,
    );
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
