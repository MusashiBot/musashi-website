import Header from "./Header";
import SiteFooter from "./SiteFooter";

export default function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
