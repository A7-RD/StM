import LenisProvider from "@/components/LenisProvider";
import SalInitializer from "@/components/salInitializer";
import MobileNav from "@/components/mobileNav";
import "swiper/css";
import "../../styles/site.scss";

export default function SiteLayout({ children }) {
  return (
    <LenisProvider>
      <MobileNav />
      <SalInitializer />
      {children}
    </LenisProvider>
  );
}
