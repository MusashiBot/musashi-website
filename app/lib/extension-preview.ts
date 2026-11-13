export const previewPosts = [
  {
    topic: "Sports",
    text: "Seattle’s starting quarterback has been ruled out for Sunday. That changes the conversation.",
    market: "Will Seattle win Sunday’s game?",
    short: "Seattle game winner",
    yes: 42,
    connection: "Lineup news → game outcome",
  },
  {
    topic: "Economy",
    text: "A weaker jobs report. A quieter inflation print. All eyes on the next Fed meeting.",
    market: "Will the Fed cut rates at its next meeting?",
    short: "Next Fed rate decision",
    yes: 61,
    connection: "Economic news → rate decision",
  },
  {
    topic: "Policy",
    text: "The Senate has scheduled a vote on the stablecoin bill for Friday. One step closer.",
    market: "Will a stablecoin bill become law this quarter?",
    short: "Stablecoin legislation",
    yes: 57,
    connection: "Legislative news → bill becoming law",
  },
] as const;

export function receiptText(visited: number[], saved: number[]) {
  return [
    "MUSASHI",
    "daily receipt / website preview",
    "13 NOV 2026 · DEMO SESSION",
    "--------------------------------",
    `posts explored          ${visited.length.toString().padStart(2, "0")}`,
    `markets surfaced        ${visited.length.toString().padStart(2, "0")}`,
    `saved for later         ${saved.length.toString().padStart(2, "0")}`,
    "trades executed         00",
    "--------------------------------",
    ...visited.map(
      (i) =>
        `${previewPosts[i].short} / ${saved.includes(i) ? "SAVED" : "SEEN"}`,
    ),
    "--------------------------------",
    "REALIZED P&L            —",
    "No trades in this preview.",
    "Fictional posts, markets and odds.",
    "musashi.bot",
  ].join("\n");
}
