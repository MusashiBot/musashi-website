import data from "../../public/downloads/musashi-match-examples.json";

export type Decision = "relevant" | "irrelevant" | "uncertain";
export type Candidate = {
  venue: "polymarket" | "kalshi";
  market_id: string | null;
  url: string | null;
  question: string | null;
  deadline: string | null;
  rules_url: string | null;
  verified_at: string | null;
  decision: Decision;
  reason: string;
  evidence: { url: string; note: string }[];
  missing_information: string[];
};
export type ReviewItem = {
  id: string;
  input: {
    text: string;
    source_url: string | null;
    source_published_at: string | null;
  };
  candidates: Candidate[];
};
export type ReviewBatch = {
  schema_version: string;
  batch_id: string;
  reviewed_at: string | null;
  retrospective: boolean;
  items: ReviewItem[];
};
export const examples = data as ReviewBatch;

export const sampleLabels: Record<
  string,
  {
    title: string;
    kind: "Retrospective review" | "Incomplete-input demonstration";
  }
> = {
  "match-01": {
    title: "The exact Fed meeting and rate change",
    kind: "Retrospective review",
  },
  "match-02": {
    title: "Negative evidence is still relevant",
    kind: "Retrospective review",
  },
  "match-03": {
    title: "Enactment, even before the effective date",
    kind: "Retrospective review",
  },
  "match-04": {
    title: "The specified inflation measure",
    kind: "Retrospective review",
  },
  "match-05": {
    title: "Right central bank, wrong meeting",
    kind: "Retrospective review",
  },
  "match-06": {
    title: "A different central bank",
    kind: "Retrospective review",
  },
  "match-07": {
    title: "Producer prices are not consumer prices",
    kind: "Retrospective review",
  },
  "match-08": {
    title: "The wrong country’s tariff order",
    kind: "Retrospective review",
  },
  "match-09": {
    title: "A feasibility study is not agency creation",
    kind: "Retrospective review",
  },
  "match-10": {
    title: "Contract rules withheld from the packet",
    kind: "Incomplete-input demonstration",
  },
  "match-11": {
    title: "An incomplete headline without a source",
    kind: "Incomplete-input demonstration",
  },
  "match-12": {
    title: "A candidate market we cannot identify",
    kind: "Incomplete-input demonstration",
  },
};
