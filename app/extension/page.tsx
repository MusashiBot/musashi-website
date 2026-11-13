import PageFrame from "../components/PageFrame";
import MusashiExperience from "../components/MusashiExperience";
import { createPageMetadata } from "../lib/seo";
export const metadata = createPageMetadata({
  title: "Musashi extension",
  description:
    "Explore the Musashi X extension and its signal-receipt concept.",
  path: "/extension/",
});
export default function Extension() {
  return (
    <PageFrame>
      <div className="extension-product">
        <MusashiExperience />
      </div>
    </PageFrame>
  );
}
