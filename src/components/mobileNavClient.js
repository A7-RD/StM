"use client";
import { useState } from "react";
import MobileToggle from "./mobileToggle";
import MobileMenu from "./mobileMenu";

export default function MobileNavClient({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <MobileToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
    </>
  );
}
