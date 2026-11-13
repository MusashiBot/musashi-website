import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../out/", import.meta.url));
const expected = [
  "index.html",
  "samples/index.html",
  "docs/index.html",
  "privacy/index.html",
  "privacy/legacy-extension/index.html",
  "retired/index.html",
  "404.html",
  "_headers",
  "_redirects",
  "downloads/musashi-feed-demo.json",
  "downloads/musashi-match-examples.json",
  "downloads/review-batch.schema.json",
  "downloads/submission-template.json",
];
for (const file of expected)
  assert(fs.existsSync(path.join(root, file)), `Missing export: ${file}`);
const forbidden = [
  /musashi-api\.vercel\.app/i,
  /musashi-production\.up\.railway\.app/i,
  /no rate limits/i,
  /npm run agent/i,
  /Trade the.*Tweets/i,
  /71 tracked accounts/i,
  /vercel\/analytics/i,
  /musashimarket/i,
  /Get 5 picks checked free/i,
  /\$200 covers 25/i,
  /projected @ 24\/7/i,
  /priceCurrency/i,
];
for (const file of [
  "index.html",
  "samples/index.html",
  "docs/index.html",
  "privacy/index.html",
]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const regex of forbidden)
    assert(!regex.test(html), `Retired claim in ${file}: ${regex}`);
}
const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (homepage.includes("TOTAL EDGE")) {
  assert(
    homepage.includes("Shortened sample") &&
      homepage.includes("illustrative figures"),
    "Supplied signal figures must retain their sample label",
  );
}
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
assert(
  !/\/arb|\/install|\/retired|\/legacy-extension/.test(sitemap),
  "Retired routes in sitemap",
);
assert(
  /noindex/.test(
    fs.readFileSync(path.join(root, "retired/index.html"), "utf8"),
  ),
  "Retirement notice must be noindex",
);
assert(
  !fs.existsSync(path.join(root, "api")),
  "Static release must not expose API routes",
);
assert(
  !fs.existsSync(path.join(root, "private-batches")),
  "Private material in export",
);
console.log(
  "Export checked: routes, downloads, retired claims, metadata, and private-data boundary.",
);
for (const page of [
  "archive/index.html",
  "investors/index.html",
  "people/index.html",
  "extension/index.html",
  "feed.xml",
])
  assert(
    fs.existsSync(path.join(root, page)),
    `Publication export missing: ${page}`,
  );
assert(
  homepage.includes("The daily briefing for"),
  "Publication promise missing",
);
assert(
  !homepage.includes("Polymarket,<!-- -->"),
  "Extension must not be the publication headline",
);
const feed = fs.readFileSync(path.join(root, "feed.xml"), "utf8");
assert(
  feed.includes('<rss version="2.0">') && feed.includes("<channel>"),
  "RSS document missing",
);
const extension = fs.readFileSync(
  path.join(root, "extension/index.html"),
  "utf8",
);
assert(
  extension.includes("jjnfhhfdfeglfncccjjpojbnngodaepk"),
  "Official extension download lost",
);
assert(
  extension.includes("TOTAL EDGE") &&
    extension.includes("illustrative figures"),
  "Supplied receipt label lost",
);
console.log(
  "Publication checked: archive, directories, RSS, side-product download, and receipt label.",
);
