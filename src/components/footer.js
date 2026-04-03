import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
export default function Footer({ data }) {
  return (
    <footer className="footer flex space-between m-flex-col">
      <div className="flex flex-col space-between capitalize m-order-2 m-mt50">
        <div className="flex flex-col align-start gap-20">
          <div className="flex flex-col align-start">
            <a href={data?.phone?.link ?? ""}>{data?.phone?.text}</a>
            <a href={data?.address?.link ?? ""} target="_blank" rel="noopener noreferrer">{data?.address?.text}</a>
          </div>
          <a className="lowercase" href={data?.handle?.link ?? ""} target="_blank" rel="noopener noreferrer">{data?.handle?.text}</a>
        </div>
        <p className="tagline">{data?.tagline}</p>
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
