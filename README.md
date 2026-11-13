# Musashi

The daily briefing for prediction-market builders. Next.js static export on the existing Cloudflare Pages Free project `musashi-match`, served at https://musashi.bot.

- `npm ci`
- `npm test`
- `npm run build`
- `npm run check:export`
- `npm run preview`

Read [HARK_HANDOFF.md](HARK_HANDOFF.md) for daily publication instructions. Research is stored as Markdown in `content/issues/`, with JSON metadata on its first line. Hark writes the words; Codex publishes them after checking sources and the build. The standing reference is GitHub issue #3; never close it.

There are no published daily briefs yet. The site shows an honest empty archive until the first research issue arrives. Email subscriptions are not enabled; RSS is live at `/feed.xml`. The extension is secondary at `/extension/`. No production model calls, database, accounts, or new paid services.

Operations records, customer material, screenshots and environment files are not publication source. Never commit them.
