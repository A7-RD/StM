"use client";

import { useCallback, useState } from "react";
import ReservationButton from "./reservationButton";
import MobileToggle from "./mobileToggle";
import MobileMenu from "./mobileMenu";

export default function Masthead({ headerData, footerData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const onToggle = useCallback(() => setMenuOpen((open) => !open), []);

  return (
    <>
      <div className="masthead flex justify-center align-start">
        <ReservationButton data={headerData} />
        <MobileToggle isOpen={menuOpen} onToggle={onToggle} />
      </div>
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        headerData={headerData}
        footerData={footerData}
      />
    </>
  );
}
