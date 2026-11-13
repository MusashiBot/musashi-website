import { previewPosts } from "../lib/extension-preview";

export default function DailyReceipt({
  visited,
  saved,
  miniature = false,
}: {
  visited: number[];
  saved: number[];
  miniature?: boolean;
}) {
  return (
    <div className={`receipt-paper ${miniature ? "receipt-mini" : ""}`}>
      <div className="receipt-brand">MUSASHI</div>
      <p className="receipt-subtitle">daily receipt</p>
      <div className="receipt-rule" />
      <div className="receipt-pair receipt-date">
        <span>13 NOV 2026</span>
        <span>DEMO / 001</span>
      </div>
      <div className="receipt-pair">
        <span>posts explored</span>
        <span>{String(visited.length).padStart(2, "0")}</span>
      </div>
      <div className="receipt-pair">
        <span>markets surfaced</span>
        <span>{String(visited.length).padStart(2, "0")}</span>
      </div>
      <div className="receipt-pair">
        <span>saved for later</span>
        <span key={saved.length} className="receipt-count">
          {String(saved.length).padStart(2, "0")}
        </span>
      </div>
      <div className="receipt-pair">
        <span>trades executed</span>
        <span>00</span>
      </div>
      <div className="receipt-rule" />
      <div className="receipt-pair receipt-table-head">
        <span>MARKET</span>
        <span>STATUS</span>
      </div>
      <div className="receipt-market-list">
        {visited.map((i) => (
          <div className="receipt-pair receipt-market" key={i}>
            <span>{previewPosts[i].short}</span>
            <span className={saved.includes(i) ? "receipt-saved" : ""}>
              {saved.includes(i) ? "SAVED" : "SEEN"}
            </span>
          </div>
        ))}
      </div>
      <div className="receipt-rule" />
      <div className="receipt-pair receipt-total">
        <span>REALIZED P&amp;L</span>
        <span>—</span>
      </div>
      <p className="receipt-no-trades">No trades in this preview.</p>
      <div className="receipt-rule" />
      <p className="receipt-thanks">
        thank you for exploring
        <br />
        with musashi
      </p>
      <div className="receipt-barcode" aria-hidden="true" />
      <p className="receipt-bottom">musashi.bot · concept preview</p>
    </div>
  );
}
