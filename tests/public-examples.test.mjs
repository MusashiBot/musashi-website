import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateBatch } from "../scripts/match-lib.mjs";
const batch = JSON.parse(
  fs.readFileSync(
    new URL("../public/downloads/musashi-match-examples.json", import.meta.url),
    "utf8",
  ),
);

test("public batch validates, has 12 unique cases and a balanced decision set", () => {
  assert.deepEqual(validateBatch(batch), []);
  assert.equal(batch.items.length, 12);
  assert.equal(batch.retrospective, true);
  for (const decision of ["relevant", "irrelevant", "uncertain"])
    assert.equal(
      batch.items.filter((i) => i.candidates[0].decision === decision).length,
      4,
    );
});
test("public classified contracts match captured venue identities and raw dates", () => {
  for (const item of batch.items.filter(
    (i) => i.candidates[0].decision !== "uncertain",
  )) {
    const c = item.candidates[0];
    const record = JSON.parse(
      fs.readFileSync(
        new URL(
          `../ops/evidence/polymarket-${c.market_id}.json`,
          import.meta.url,
        ),
        "utf8",
      ),
    );
    assert.equal(c.market_id, record.id);
    assert.equal(c.question, record.question);
    assert.equal(c.deadline, record.endDate);
    assert(c.url.endsWith("/" + record.slug));
    assert(c.evidence.some((e) => e.url === item.input.source_url));
    assert(c.evidence.some((e) => e.url === c.rules_url));
  }
});
test("negative evidence remains relevant and wrong horizon has an explicit reason", () => {
  const negative = batch.items.find((i) => i.id === "match-02").candidates[0];
  assert.equal(negative.decision, "relevant");
  assert.match(negative.reason, /against.*no.change/i);
  const horizon = batch.items.find((i) => i.id === "match-05").candidates[0];
  assert.equal(horizon.decision, "irrelevant");
  assert.match(horizon.reason, /October.*September/s);
});
test("feasibility does not establish creation; deliberately missing evidence is explicit", () => {
  const proposal = batch.items.find((i) => i.id === "match-09").candidates[0];
  assert.equal(proposal.decision, "uncertain");
  assert.match(proposal.reason, /does not demonstrate/);
  for (const id of ["match-10", "match-11", "match-12"]) {
    const item = batch.items.find((i) => i.id === id);
    assert.match(item.input.text, /Incomplete-input demonstration/);
    assert.equal(item.candidates[0].decision, "uncertain");
    assert(item.candidates[0].missing_information.length > 0);
  }
  assert.equal(
    batch.items.find((i) => i.id === "match-12").candidates[0].market_id,
    null,
  );
});
