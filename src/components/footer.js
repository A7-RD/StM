import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import RestaurantHours from "./restaurantHours";

function FooterAddress({ address }) {
  const hasLines = Boolean(address?.street || address?.cityState);
  const href = address?.link ?? "";

  if (hasLines) {
    const inner = (
      <>
        {address?.street ? <span>{address.street}</span> : null}
        {address?.cityState ? <span>{address.cityState}</span> : null}
      </>
    );
    if (href) {
      return (
        <a
          className="footer__address"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      );
    }
    return <div className="footer__address">{inner}</div>;
  }

  if (address?.text) {
    return (
      <a
        className="footer__address"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {address.text}
      </a>
    );
  }

  return null;
}

export default function Footer({ data }) {
  return (
    <footer className="footer flex space-between m-flex-col">
      <div className="footer__column flex flex-col space-between capitalize m-order-2">
        <div className="footer__primary">
          <div className="footer__contact">
            <a href={data?.phone?.link ?? ""}>{data?.phone?.text}</a>
            <FooterAddress address={data?.address} />
          </div>
          <RestaurantHours hours={data?.hours} className="footer-hours" />
          <a
            className="footer__social lowercase"
            href={data?.handle?.link ?? ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data?.handle?.text}
          </a>
        </div>
        <p className="footer__tagline">{data?.tagline}</p>
      </div>
      {data?.image && (
        <div className="piano ratio-183-197 pos-rel w-180px m-order-1 m-mb60 m-mx-auto">
          <Image
            className="bg-image contain"
            src={urlFor(data.image).url()}
            alt=""
            width={183}
            height={197}
          />
        </div>
      )}
    </footer>
  );
}
