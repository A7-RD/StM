import LenisProvider from "@/components/LenisProvider";
import SalInitializer from "@/components/salInitializer";
import "swiper/css";
import "../../styles/site.scss";

export default function SiteLayout({ children }) {
  return (
    <LenisProvider>
      <SalInitializer />
      {children}
    </LenisProvider>
  );
}
