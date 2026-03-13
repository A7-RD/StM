import Image from "next/image";
import RestaurantHours from "./restaurantHours";

export default function MobileMenu({ isOpen, onClose, data, phone }) {
  return (
    <div className={`mobile-menu${isOpen ? " is-open" : ""}`}>
      <div className="mobile-menu__logo">
        <Image
          src="/images/mobile-logo.png"
          width={66}
          height={66}
          alt="St. Martins"
        />
      </div>
      <div className="center">
        <nav className="mobile-menu__nav">
          <a onClick={onClose} href="#">
            Dinner Menu
          </a>
          <a onClick={onClose} href="#">
            Wine List
          </a>
          <a onClick={onClose} href="#">
            Cocktails &amp; Spirits
          </a>
        </nav>
        <a
          className="button-secondary rings-visible"
          href={data?.reservation?.link}
        >
          {data?.reservation?.button ?? "Make a Reservation"}
        </a>
        <a
          className="button-secondary rings-visible text-center"
          href={phone?.link}
        >
          {phone?.text}
        </a>
      </div>
      <div className="mobile-menu__footer">
        <div className="flex gap-5 f-14">
          <div>{data?.address?.street}</div>
          <div>{data?.address?.cityState}</div>
        </div>
        <RestaurantHours hours={data?.hours} />
      </div>
    </div>
  );
}
