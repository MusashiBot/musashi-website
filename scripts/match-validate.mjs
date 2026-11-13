#!/usr/bin/env node
import { parseArgs, readJson, validateBatch } from "./match-lib.mjs";
try {
  const args = parseArgs(process.argv.slice(2), ["input"]);
  if (!args)
    console.log(
      "Usage: node scripts/match-validate.mjs --input batch.json [--draft]\nValidates structure and evidence requirements. It cannot establish whether a URL or claim is true.",
    );
  else {
    const errors = validateBatch(readJson(args.input), {
      draft: args.draft === true,
    });
    if (errors.length) throw new Error(errors.join("\n"));
    console.log(
      args.draft
        ? "Draft structure valid. Review is incomplete."
        : "Batch structure valid. Independently check every source and contract before delivery.",
    );
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
