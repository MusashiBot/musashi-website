#!/usr/bin/env node
import { draftBatch, parseArgs, readJson, writePrivate } from "./match-lib.mjs";
try {
  const args = parseArgs(process.argv.slice(2), ["input", "output"]);
  if (!args)
    console.log(
      "Usage: node scripts/match-init.mjs --input submission.json --output private-batches/customer/draft.json\nCreates an unreviewed draft. Never overwrites files. No network or model calls.",
    );
  else
    console.log(
      `Draft created: ${writePrivate(args.output, `${JSON.stringify(draftBatch(readJson(args.input)), null, 2)}\n`)}`,
    );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
