const signals = [
  ["trump iran ops", "+$1.96"],
  ["sanchez peru 2026", "+$1.56"],
  ["vance 2028 gop", "+$0.49"],
  ["rubio 2028 us", "+$0.49"],
  ["boston celtics nba", "+$0.47"],
  ["spain world cup 2026", "+$0.35"],
  ["iran x israel apr 15", "+$0.34"],
  ["spurs 2026 nba", "+$0.29"],
  ["atletico madrid ucl", "+$0.28"],
  ["france world cup 2026", "+$0.20"],
];

export default function HeroSignalReceipt() {
  return (
    <div
      className="receipt-paper hero-signal-receipt"
      aria-label="Supplied sample signal receipt, illustrative figures"
    >
      <div className="receipt-brand">MUSASHI</div>
      <p className="receipt-subtitle">signal receipt</p>
      <div className="receipt-rule" />
      <div className="signal-pair signal-date">
        <span>APR 21 2026</span>
        <span>19:38 UTC</span>
      </div>
      <div className="signal-pair">
        <span>window</span>
        <span>19:10 – 19:38</span>
      </div>
      <div className="signal-pair">
        <span>markets scanned</span>
        <span>28</span>
      </div>
      <div className="signal-pair">
        <span>signals generated</span>
        <span>10</span>
      </div>
      <div className="receipt-rule" />
      <div className="signal-pair signal-table-head">
        <span>SIGNALS</span>
        <span>EDGE</span>
      </div>
      <div>
        {signals.map(([event, edge]) => (
          <div className="signal-pair signal-event" key={event}>
            <span>{event}</span>
            <span>{edge}</span>
          </div>
        ))}
      </div>
      <div className="receipt-rule" />
      <div className="signal-pair">
        <span>SUBTOTAL</span>
        <span>$19.67</span>
      </div>
      <div className="signal-pair">
        <span>TAX</span>
        <span>—</span>
      </div>
      <div className="signal-total">
        <span>TOTAL EDGE</span>
        <strong>$19.67</strong>
      </div>
    </div>
  );
}
