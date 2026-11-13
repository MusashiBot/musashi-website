import PageFrame from "../components/PageFrame";
import HeroSignalReceipt from "../components/HeroSignalReceipt";
import { createPageMetadata } from "../lib/seo";
export const metadata = createPageMetadata({
  title: "Sample receipt",
  description: "Musashi’s illustrative signal receipt.",
  path: "/samples/",
});
export default function Samples() {
  return (
    <PageFrame>
      <div className="shell page-intro">
        <p className="eyebrow">Sample receipt</p>
        <h1>Your day, on one receipt.</h1>
        <p>Illustrative figures from the supplied receipt design.</p>
        <div style={{ maxWidth: 360, marginTop: 32 }}>
          <HeroSignalReceipt />
        </div>
      </div>
    </PageFrame>
  );
}
