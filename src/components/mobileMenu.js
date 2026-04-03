"use client";

import Image from "next/image";
import RestaurantHours from "./restaurantHours";

export default function MobileMenu({ isOpen, onClose, headerData, footerData }) {
  return (
    <div className={`mobile-menu${isOpen ? " is-open" : ""}`}>
      {isOpen ? (
        <button
          type="button"
          className="mobile-menu__close"
          onClick={onClose}
          aria-label="Close menu"
        />
      ) : null}
      <div className="mobile-menu__logo">
        <Image
          src="/images/mobile-logo.svg"
          width={66}
          height={66}
          alt="St. Martins"
        />
      </div>
      <div className="center">
        <nav className="mobile-menu__nav">
          <a onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('menu-navigate', { detail: { target: 'dinner-menu' } })); }} href="#">
            Dinner Menu
          </a>
          <a onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('menu-navigate', { detail: { target: 'wine-list' } })); }} href="#">
            Wine List
          </a>
          {/* <a onClick={onClose} href="#">
            Cocktails &amp; Spirits
          </a> */}
        </nav>
        <a
          className="button-secondary rings-visible"
          href={headerData?.reservation?.link}
        >
          {headerData?.reservation?.button ?? "Make a Reservation"}
        </a>
        <a
          className="button-secondary rings-visible text-center"
          href={footerData?.phone?.link}
        >
          {footerData?.phone?.text}
        </a>
      </div>
      <div className="mobile-menu__footer">
        <div className="flex gap-5 f-14">
          <div>{footerData?.address?.street}</div>
          <div>{footerData?.address?.cityState}</div>
        </div>
        <RestaurantHours hours={footerData?.hours} />
      </div>
    </div>
  );
}
