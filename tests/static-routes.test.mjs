import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

// These checks exercise the exported artifact. Run after npm run build.
const hasExport = fs.existsSync(new URL("../out/index.html", import.meta.url));
test(
  "static homepage and all supported pages resolve",
  { skip: !hasExport },
  async () => {
    const { route } = await import("../scripts/preview.mjs");
    for (const path of [
      "/",
      "/samples/",
      "/docs/",
      "/privacy/",
      "/privacy/legacy-extension/",
      "/retired/",
      "/downloads/musashi-match-examples.json",
    ])
      assert.equal(route(path).status, 200, path);
  },
);
test(
  "legacy redirects preserve intent without catching API or unknown routes",
  { skip: !hasExport },
  async () => {
    const { route } = await import("../scripts/preview.mjs");
    for (const path of [
      "/arb",
      "/arb/old-market",
      "/install/",
      "/blog/old-post",
      "/compare/",
      "/data-license",
      "/docs/polymarket-api",
    ])
      assert.equal(route(path).location, "/retired/", path);
    assert.equal(route("/pricing").location, "/docs/#availability");
    assert.equal(route("/ai").location, "/docs/");
    for (const path of [
      "/api/markets",
      "/api/markets/arbitrage",
      "/this-page-never-existed",
      "/%2e%2e%2fpackage.json",
    ])
      assert.equal(route(path).status, 404, path);
  },
);
