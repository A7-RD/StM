import { sanityFetch } from "@/sanity/lib/live";
import MobileNavClient from "./mobileNavClient";

export default async function MobileNav() {
  const { data } = await sanityFetch({
    query: `{ "header": *[_type == "header"][0], "phone": *[_type == "footer"][0].phone }`,
  });
  return <MobileNavClient data={data?.header} phone={data?.phone} />;
}
